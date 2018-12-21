// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
cc.Class({
    extends: cc.Component,

    properties: {
        curYear: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        curMonth: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        curDay: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        challengeDay: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        maxDay: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        firstDay: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        challengeIdx: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        medalVal: {
            default: [],
            type: [cc.Node],
        },
        missionVal: {
            default: [],
            type: [cc.Float],
            visible: false,
        },
        titleMonth: {
            default: null,
            type: cc.Label,
        },
        titleDay: {
            default: null,
            type: cc.Label,
        },
        tipsSprite: {
            default: null,
            type: cc.Node,
        },
        tipsSprite1: {
            default: null,
            type: cc.Node,
        },
        progress: {
            default: null,
            type: cc.ProgressBar,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        winCrown: {
            default: null,
            type: cc.Node,
        },
        uiList: {
            default: [],
            visible: false,
        },
        item: {
            default: null,
            type: cc.Node,
        },
        uiViewAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.node.setLocalZOrder(1500);
        this.tipsSprite.active = true;
        this.tipsSprite1.active = true;
        this.checkReSet();
        this.reFresh();
        if (window.isPlaying) {
            window.isPlaying = false;
            window.isPoP = true;
        } else {
            //如果不在游戏中却是在挑战状态则表示为已经结束
            if (window.isChallenge) {
                window.isPoP = false;
                window.isChallenge = false;
                if (window.isWin) {
                    SDK().getItem("challenge" + this.challengeDay, function (chVal) {
                        if (chVal != 1) {
                            var param = {};
                            param["challenge" + this.challengeDay] = 1;
                            SDK().setItem(param);
                            SDK().getItem("winCount", function (val) {
                                val = val + 1;
                                this.progress.progress = val / this.maxDay;
                                SDK().setItem({ winCount: val });
                            }.bind(this));
                        }
                    }.bind(this))
                    this.uiList[this.challengeDay + this.firstDay].win.active = true;
                    this.scheduleOnce(function () {
                        this.winDownAnim();
                    }.bind(this), 0.5)
                }
            }
        }
    },

    winDownAnim() {
        this.winCrown.opacity = 0;
        this.winCrown.scale = 5;
        window.gameApplication.soundManager.playSound("getKey");
        this.winCrown.runAction(cc.spawn(
            cc.fadeIn(0.5),
            cc.scaleTo(0.4, 1).easing(cc.easeIn(3)),
        ));
    },

    onDisable() {
        if (window.isPoP) {
            window.isPoP = false;
            window.isPlaying = true;
        }
    },

    onLoad() {
        window.dailyScript = this;
        this.challengeDay = 0;
        this.init();
    },

    checkCurDay() {
        var myDate = new Date();
        let day = myDate.getDate();
        SDK().getItem("challenge" + (day-1), function (point) {
            if (point == 1) {
                this.tipsSprite.active = false;
                this.tipsSprite1.active = false;
            }else{
                this.tipsSprite.active = true;
                this.tipsSprite1.active = true;
            }
        }.bind(this));
    },

    init() {
        var myDate = new Date();
        let year = myDate.getFullYear();
        let month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        day = day - 1;
        this.curYear = year;
        this.curMonth = month;
        this.curDay = day;
        this.challengeDay = day;
        this.titleDay.string = (day + 1);
        this.titleMonth.string = myDate.toDateString().split(" ")[1];

        var temp = new Date(this.curYear, this.curMonth + 1, 0);
        var temp1 = new Date(this.curYear, this.curMonth + 1, 1);
        this.maxDay = temp.getDate();
        this.firstDay = temp.getDay();
    },

    //检查是否需要重置任务
    checkReSet() {
        SDK().getItem("ChallengeMonth", function (m) {
            if (m == null || m == 0) {
                SDK().setItem({ ChallengeMonth: this.curMonth });
                this.reSet();
            } else {
                if (m != this.curMonth) {
                    SDK().setItem({ ChallengeMonth: this.curMonth });
                    this.reSet();
                }
            }
        }.bind(this))
    },

    //重置挑战
    reSet() {
        this.reFresh(true);
        this.reFresh(false);
    },

    //刷新挑战
    reFresh(isReSet) {
        if (isReSet) {
            SDK().setItem({ winCount: 0 });
        } else {
            //进度条刷新
            SDK().getItem("winCount", function (val) {
                this.progress.progress = val / this.maxDay;
                if (this.progress.progress < 0.3) {
                    this.medalVal[0].color = cc.color(125, 125, 125);
                    this.medalVal[1].color = cc.color(125, 125, 125);
                    this.medalVal[2].color = cc.color(125, 125, 125);
                } else if (this.progress.progress < 0.6) {
                    this.medalVal[0].color = cc.color(255, 255, 255);
                    this.medalVal[1].color = cc.color(125, 125, 125);
                    this.medalVal[2].color = cc.color(125, 125, 125);
                } else if (this.progress.progress < 0.9) {
                    this.medalVal[0].color = cc.color(255, 255, 255);
                    this.medalVal[1].color = cc.color(255, 255, 255);
                    this.medalVal[2].color = cc.color(125, 125, 125);
                } else {
                    this.medalVal[0].color = cc.color(255, 255, 255);
                    this.medalVal[1].color = cc.color(255, 255, 255);
                    this.medalVal[2].color = cc.color(255, 255, 255);
                }
            }.bind(this));
        }
        var firstDay = this.firstDay;
        var maxDay = this.maxDay;
        var curNode = null;
        for (var i = 0; i < firstDay; i = i + 1) {
            if (this.uiList[i] == null) {
                curNode = cc.instantiate(this.item);
                curNode.parent = this.content;
                curNode.active = true;
                this.uiList[i] = {},
                    this.uiList[i].node = curNode;
                this.uiList[i].bg = curNode.getChildByName("Bg").getComponent(cc.Sprite);
                this.uiList[i].shadow = curNode.getChildByName("Shadow").getComponent(cc.Sprite);
                this.uiList[i].day = curNode.getChildByName("Day").getComponent(cc.Label);
                this.uiList[i].win = curNode.getChildByName("Win");
            }
            this.uiList[i].bg.node.active = false;
            this.uiList[i].shadow.node.active = false;
            this.uiList[i].day.node.active = false;
            this.uiList[i].win.active = false;
        }
        for (var i = 0; i < maxDay; i = i + 1) {
            if (this.uiList[i + firstDay] == null) {
                curNode = cc.instantiate(this.item);
                curNode.parent = this.content;
                curNode.active = true;
                this.uiList[i + firstDay] = {},
                    this.uiList[i + firstDay].node = curNode;
                this.uiList[i + firstDay].bg = curNode.getChildByName("Bg").getComponent(cc.Sprite);
                this.uiList[i + firstDay].shadow = curNode.getChildByName("Shadow").getComponent(cc.Sprite);
                this.uiList[i + firstDay].day = curNode.getChildByName("Day").getComponent(cc.Label);
                this.uiList[i + firstDay].win = curNode.getChildByName("Win");
            }
            this.uiList[i + firstDay].bg.node.active = true;
            this.uiList[i + firstDay].shadow.node.active = false;
            this.uiList[i + firstDay].day.node.active = true;
            this.uiList[i + firstDay].win.active = false;

            //bg deal
            if (i <= this.curDay) {
                this.uiList[i + firstDay].bg.spriteFrame = this.uiViewAtlas.getSpriteFrame("bg15");
                if (i == this.challengeDay) {
                    this.uiList[i + firstDay].bg.spriteFrame = this.uiViewAtlas.getSpriteFrame("bg16");
                }
                if (i == this.curDay) {
                    window.gameApplication.shadowFadeOutAnim(this.uiList[i + firstDay].node, 3, 1.2, true);
                }
                //按钮监听注册
                this.uiList[i + firstDay].node.off(cc.Node.EventType.TOUCH_END);
                this.uiList[i + firstDay].node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    this.btnClick(event);
                }.bind(this), this);
            } else {
                this.uiList[i + firstDay].bg.spriteFrame = null;
            }

            //dayString deal
            this.uiList[i + firstDay].day.string = i + 1;

            if (isReSet) {
                var param = {};
                param["challenge" + i] = 0;
                SDK().setItem(param);
                SDK().getItem("challengeMap", function (mapIdx) {
                    if (mapIdx == null || mapIdx == 0) {
                        mapIdx = 1;
                        SDK().setItem({ challengeMap: 1 });
                    } else {
                        mapIdx = ((mapIdx + 1) % 600) + 1;
                        SDK().setItem({ challengeMap: mapIdx });
                    }
                })
            } else {
                this.checkDay(i);
            }
        }
    },

    //检查该天是否挑战成功
    checkDay(i) {
        SDK().getItem("challenge" + i, function (point) {
            if (point == 1) {
                this.uiList[i + this.firstDay].win.active = true;
                this.progress.progress = this.progress.progress + 1 / this.maxDay;
                if (i == this.curDay) {
                    this.winCrown.opacity = 255;
                    this.tipsSprite.active = false;
                    this.tipsSprite1.active = false;
                }
            }
        }.bind(this));
    },

    //按钮点击事件
    btnClick(event) {
        window.gameApplication.soundManager.playSound("btn_click");
        for (var i = this.firstDay; i < this.firstDay + this.maxDay; i = i + 1) {
            //找到点击的按钮
            if (event.target == this.uiList[i].node) {
                //如果挑战的不等于减去前面空白天数
                if (this.challengeDay != (i - this.firstDay)) {
                    this.uiList[this.challengeDay + this.firstDay].bg.spriteFrame = this.uiViewAtlas.getSpriteFrame("bg15");
                    this.challengeDay = i - this.firstDay;
                    this.uiList[i].bg.spriteFrame = this.uiViewAtlas.getSpriteFrame("bg16");
                    this.titleDay.string = (this.challengeDay + 1);
                    SDK().getItem("challenge" + this.challengeDay, function (point) {
                        if (point == 1) {
                            this.winCrown.opacity = 255;
                        } else {
                            this.winCrown.opacity = 0;
                        }
                    }.bind(this));
                }
            }
        }
    },

    goChallenge() {
        window.gameApplication.soundManager.playSound("btn_click");
        var idx;
        SDK().getItem("challengeMap", function (mapIdx) {
            idx = (mapIdx - (this.curDay - this.challengeDay))
            if (idx <= 0) {
                idx = 600 + idx;
            }
            window.isChallenge = true;
            window.challengeIdx = idx;
            window.gameApplication.goChallenge();
        }.bind(this));
    },

    backMainView() {
        window.gameApplication.soundManager.playSound("btn_click");
        if (window.isPoP) {
            window.gameApplication.openDailyView(false);
        } else {
            window.gameApplication.openMainView(true);
        }
    },

    update(dt) {
    },
});
