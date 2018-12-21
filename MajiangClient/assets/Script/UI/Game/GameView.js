import { isContext } from "vm";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var colors = [cc.color(255, 138, 138, 255), cc.color(255, 240, 138, 255), cc.color(183, 255, 138, 255), cc.color(138, 228, 255, 255), cc.color(192, 138, 255, 255)];
var lColors = [cc.color(204, 71, 71, 255), cc.color(236, 214, 66, 255), cc.color(115, 216, 52, 255), cc.color(70, 183, 218, 255), cc.color(133, 63, 214, 255)];
var drawSize = [602, 773];
var spriteAnimation = require("../SpriteAnimation");
cc.Class({
    extends: cc.Component,

    properties: {
        guideMask: {
            default: null,
            type: cc.Node,
        },
        gameApplication: {
            default: null,
            visible: false,
        },
        progress: {
            default: null,
            type: cc.ProgressBar
        },
        drawView: {
            default: null,
            type: cc.Node,
        },
        btns: {
            default: null,
            type: cc.Node,
        },
        endView: {
            default: null,
            type: cc.Node,
        },
        giftBtn: {
            default: null,
            type: cc.Node,
        },
        warn: {
            default: null,
            type: cc.Node,
        },
        levelText: {
            default: null,
            type: cc.Label,
        },
        stageText: {
            default: null,
            type: cc.Label,
        },
        tipText: {
            default: null,
            type: cc.Label,
        },
        curMahjongs: {
            default: null,
            visible: false,
        },
        curMap: {
            default: null,
            visible: false,
        },
        leaveStars: {
            default: [],
            type: [cc.Sprite],
        },
        selectList: {
            default: [],
            visible: false,
        },
        movableList: {
            default: [],
            visible: false,
        },
        unMovableList: {
            default: [],
            visible: false,
        },
        leaveList: {
            default: [],
            visible: false,
        },
        movableList: {
            default: [],
            visible: false,
        },
        curHelpIdx: {
            default: [],
            visible: false,
        },
        backList: {
            default: [],
            visible: false,
        },
        isHelping: {
            default: false,
            visible: false,
        },
        leaveTime: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        curMapTime: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        curStage: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        lid: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        reFreshCount: {
            default: 0,
            tpye: cc.Integer,
            visible: false,
        },
        boomBg: {
            default: null,
            type: spriteAnimation,
        },
        boomAnim: {
            default: null,
            type: spriteAnimation,
        },
        boomAnim1: {
            default: null,
            type: spriteAnimation,
        },
        brokenBoomAnim: {
            default: null,
            type: cc.Node,
        },
        noBrokenFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        brokenFrame: {
            default: null,
            type: cc.SpriteFrame,
        },
        selectAnim: {
            default: [],
            type: [cc.Node],
        },
        isDrawMap: {
            default: false,
            visible: false,
        },
        mahjongOnZ: {
            default: [],
            visible: false,
        },
        pauseView: {
            default: null,
            type: cc.Node,
        },
        musicBtn: {
            default: null,
            type: cc.Toggle,
        },
        soundBtn: {
            default: null,
            type: cc.Toggle,
        },
        //榜单界面
        worldBtn: {
            default: null,
            type: cc.Node,
        },
        friendBtn: {
            default: null,
            type: cc.Node,
        },
        worldList: {
            default: null,
            type: cc.Node,
        },
        friendList: {
            default: null,
            type: cc.Node,
        },
        worldContent: {
            default: null,
            type: cc.Node,
        },
        friendContent: {
            default: null,
            type: cc.Node,
        },
        //头像储存
        headSpriteList: {
            default: {},
            visible: false,
        },
        //储存用户信息列表
        worldPlayer: {
            default: [],
            visible: false,
        },
        friendPlayer: {
            default: [],
            visible: false,
        },
        //储存用户UI列表
        worldUIPlayer: {
            default: [],
            visible: false,
        },
        friendUIPlayer: {
            default: [],
            visible: false,
        },
        gameAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        object_prefab: {
            default: null,
            type: cc.Prefab,
        },
        prefab_player: {
            default: null,
            type: cc.Prefab,
        },
        //分享界面
        goShareView: {
            default: null,
            type: cc.Node,
        },
        isGuide: {
            default: 10,
            visible: false,
        },
    },

    onEnable() {
        window.dailyScript.checkCurDay();
        this.isDrawMap = false;
        this.drawView.active = false;
        this.drawView.scaleY = cc.winSize.height / 1136;
        this.drawView.scaleX = cc.winSize.width / 640;
        window.timeGiftScript.giftBtn.active = true;
        window.timeGiftScript.giftBtn.y = (cc.winSize.height * 0.5) - 80;
        window.timeGiftScript.giftBtn.x = (cc.winSize.width * 0.5) - 100;
        window.misstionScript.reFresh();
    },

    onDisable() {
        for (var i = 0; i < 2; i = i + 1) {
            this.selectAnim[i].tag = 0;
            this.selectAnim[i].active = false;
        }
        this.isDrawMap = false;
        this.drawView.active = false;
        window.isPlaying = false;
        this.warn.active = false;
        this.warn.stopAllActions();
        window.isGoPlay = false;
    },

    onLoad() {
        window.tipText = this.tipText;
        SDK().getItem("isFirst", function (val) {
            if (val == 0 || val == null || val == undefined) {
                SDK().setItem({ isFirst: 1 })
                SDK().setItem({ tips: 5 }, function () {
                    this.tipText.string = 5;
                    this.isGuide = 0;
                }.bind(this))
            } else {
                this.goShareView.active = true;
                SDK().getItem("tips", function (val) {
                    this.tipText.string = val;
                }.bind(this))
            }
        }.bind(this))
        this.boomBg.node.setLocalZOrder(0);
        this.boomAnim.node.setLocalZOrder(0);
        this.boomAnim1.node.setLocalZOrder(200);
    },

    start() {
        this.LoadRank();
    },

    //初始化
    initView() {
        if (window.isChallenge) {
            this.goChallenge();
        } else {
            this.initGame();
        }
    },

    goChallenge() {
        this.drawView.active = false;
        var tmp_path = "conf/level_detail/2/" + window.challengeIdx;
        window.gameApplication.getConf(tmp_path, function (map) {
            if (null != map && map.mahjongs != null) {
                this.curMap = map;
                this.drawMap(this.curMap);
            } else {
                console.log(tmp_path + " is no find!");
            }
        }.bind(this));
    },

    menuClick(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        //回到选择关卡按钮
        if ("Back" == type) {
            if (window.isChallenge) {
                window.isChallenge = false;
                this.isHelping = false;
                window.gameApplication.openMainView(true);
            } else {
                window.gameApplication.gamingBackToLevel(window.bid, window.mid);
            }
            this.pauseView.active = false;

            var levelDetail = {};
            levelDetail.level = mid + "0" + (lid > 99 ? lid : (lid > 9 ? "0" + lid : "00" + lid));
            levelDetail.reason = "回到主界面"
            gameApplication.DataAnalytics.levelResult(false, levelDetail);
        }
        //暂停按钮
        else if ("Pause" == type) {
            if (this.pauseView.active) {
                this.pauseView.active = false;
                window.isPlaying = true;
            } else {
                this.pauseView.active = true;
                window.isPlaying = false;
                this.musicBtn.isChecked = window.gameApplication.soundManager.isBgOpen;
                this.soundBtn.isChecked = window.gameApplication.soundManager.isOpen;
            }
        }
        else if ("Music" == type) {
            if (event.isChecked) {
                window.gameApplication.soundManager.setBgOpen(true);
            } else {
                window.gameApplication.soundManager.setBgOpen(false);
            }
        }
        else if ("Sounds" == type) {
            if (event.isChecked) {
                window.gameApplication.soundManager.setIsOpen(true);
            } else {
                window.gameApplication.soundManager.setIsOpen(false);
            }
        }
        //提示按钮 
        else if ("Tip" == type) {
            if (this.isHelping) {
                return;
            }
            this.isHelping = true;
            //获取提示数量
            SDK().getItem("tips", function (tip) {
                if (tip > 0) {
                    tip = tip - 1;
                    SDK().setItem({ tips: tip }, null);
                    this.tipText.string = tip;
                    this.showTip();
                } else {
                    window.gameApplication.showVideoView(function (isCompleted) {
                        if (isCompleted) {
                            window.gameApplication.soundManager.playSound("tip");
                            tip = 7;
                            SDK().setItem({ tips: tip }, null);
                            this.tipText.string = tip;
                            for (var i = 0; i < 8; i = i + 1) {
                                this.scheduleOnce(function () {
                                    window.gameApplication.flyTipAnim();
                                }.bind(this), i * 0.2)
                            }
                            this.showTip();
                        } else {
                            this.isHelping = false;
                        }
                    }.bind(this))
                }
            }.bind(this));
            //回退按钮
        } else if ("ReGresses" == type) {
            this.regresses();
        }
        //重玩
        else if ("Replay" == type) {
            if (window.isChallenge) {
                this.goChallenge();
            } else {
                this.initGame();
            }
            this.pauseView.active = false;
        }
        //下一关按钮
        else if ("Next" == type) {
            if (window.isChallenge) {
                window.gameApplication.openDailyView(true);
            } else {
                var tmp_path = "conf/level_detail/" + bid + "/" + mid + "/" + (lid + 1);
                window.gameApplication.getConf(tmp_path, function (map) {
                    if (null != map && map.mahjongs != null) {
                        this.curMap = map;
                        lid = lid + 1;
                        this.drawMap(this.curMap);
                        window.gameApplication.openEndView(false);
                        window.gameApplication.getConf("conf/level_detail/" + bid + "/" + mid + "/" + (lid + 1), null);
                    } else {
                        window.gameApplication.openEndView(false);
                        //window.gameApplication.viewManager.removeView(this.endView);
                        window.gameApplication.gamingBackToMian(window.bid, window.mid);
                    }
                }.bind(this));
            }
        }
        //榜单界面
        else if ("WorldRank" == type) {
            this.GetWorldRank(this.worldPlayer);
            this.worldList.active = true;
            this.worldBtn.active = true;
            this.friendList.active = false;
            this.friendBtn.active = false;
        } else if ("FriendRank" == type) {
            SDK().shareBestScore3Times("all");
            this.GetFriendRank(this.friendPlayer);
            this.worldList.active = false;
            this.worldBtn.active = false;
            this.friendList.active = true;
            this.friendBtn.active = true;
        } else if ("goShare" == type) {
            this.goShareView.active = false;
            SDK().getItem("all", function (val) {
                window.gameApplication.onShareBtnClick(val);
            }.bind(this));
        }
    },

    initGame() {
        var self = this;
        if (window.gameApplication != null) {
            if (window.isChallenge) {
                console.log("challenge")
            } else {
                //预加载上下两关
                var tmpId = window.lid;
                var arr = [];
                arr.push(tmpId);
                if (tmpId > 1) {
                    arr.push(tmpId - 1);
                }
                arr.push(tmpId + 1);
                arr.forEach(function (tmp_lid) {
                    var tmp_path = "conf/level_detail/" + bid + "/" + mid + "/" + tmp_lid;
                    window.gameApplication.getConf(tmp_path, function (map) {
                        if (tmp_lid == tmpId) {
                            //加载关卡
                            self.curMap = map;
                            self.drawMap(map);
                        }
                    });
                });
            }
        }
        //获取提示数量
        SDK().getItem("tips", function (tip) {
            if (tip == null) {
                tip = 0;
                SDK().setItem({ tips: 0 });
            }
            this.tipText.string = tip;
        }.bind(this));
    },


    //显示提示
    showTip() {
        if (this.curStage == 1) {
            window.misstionScript.checkMission(7, true);
            this.checkCanBump(true);
        }
    },

    //胜利动画
    winAction(isWin) {
        window.gameApplication.playTimes++;
        this.warn.active = false;
        this.warn.stopAllActions();
        window.isPlaying = false;
        this.curStage = 2;
        window.misstionScript.checkMission(6, true);
        window.misstionScript.reFresh();
        var useTime = this.curMapTime - this.leaveTime;
        window.useTime = useTime;
        if (isWin) {
            window.isWin = false;


            var levelDetail = {};
            levelDetail.level = mid + "0" + (lid > 99 ? lid : (lid > 9 ? "0" + lid : "00" + lid));
            levelDetail.reason = "过关"
            gameApplication.DataAnalytics.levelResult(true, levelDetail);

            window.isWin = true;
            var score = this.leaveTime / this.curMapTime;
            if (score > 0.5) {
                score = 3;
            } else if (score > 0.25) {
                score = 2;
            } else {
                score = 1;
            }
            window.score = score;
            if (!window.isChallenge) {
                var scoreString = bid + "_" + mid + "_" + this.lid + "_score";
                var timeString = bid + "_" + mid + "_" + this.lid + "_time";
                SDK().getItem(scoreString, function (val) {
                    if (val < score || val == null) {
                        if (val == null) {
                            val = 0;
                        }
                        var param = {};
                        param[scoreString] = score;
                        SDK().setItem(param);
                        SDK().getItem("all", function (allVal) {
                            allVal = allVal + score - val;
                            SDK().setItem({ all: allVal });
                            SDK().setRankScore(2, allVal, "{}", null);
                            this.LoadRank();
                        }.bind(this))
                    }
                }.bind(this))
                SDK().getItem(timeString, function (val) {
                    if (val > useTime || val == 0) {
                        var param = {};
                        param[timeString] = useTime;
                        SDK().setItem(param);
                    }
                }.bind(this))
            }
        } else {
            window.isWin = false;

            var levelDetail = {};
            levelDetail.level = mid + "0" + (lid > 99 ? lid : (lid > 9 ? "0" + lid : "00" + lid));
            levelDetail.reason = "失败"
            gameApplication.DataAnalytics.levelResult(false, levelDetail);
        }
        window.gameApplication.openEndView(true);
        window.timeGiftScript.giftBtn.active = false;
    },

    //回退
    regresses() {
        if (this.backList.length > 0) {
            var twain = this.backList.pop();
            this.bumpDataDeul(twain[0], twain[1], 1);
            this.setMagjongPos(twain[0], 1, 0);
            this.setMagjongPos(twain[1], 1, 0);
        }
    },



    //检测是否有可碰的牌
    checkCanBump(isTips) {
        for (var i = 0; i < this.movableList.length; i = i + 1) {
            if (this.movableList[i] == 1) {
                for (var j = 0; j < this.movableList.length; j = j + 1) {
                    if (this.movableList[j] == 1) {
                        if (this.curMahjongs[i].tag == this.curMahjongs[j].tag && i != j) {
                            if (isTips) {
                                window.gameApplication.shake(this.curMahjongs[i]);
                                window.gameApplication.shake(this.curMahjongs[j]);
                                this.curHelpIdx = [i, j];
                            }
                            this.reFreshCount = 0;
                            return true;
                        }
                    }
                }
            }
        }
        this.reFreshCount = this.reFreshCount + 1;
        this.refreshMap();
    },

    //洗牌
    refreshMap() {
        //var leaveTag = [];
        this.mahjongOnZ = [];
        var canMove = [];
        var leaveNum = 0;
        var twain = [];
        var maxVal = 0;
        var minVal = 100;

        /* //搜索剩下的牌
        for (var i = 0; i < this.leaveList.length; i = i + 1) {
            if (this.leaveList[i] != null) {
                if (this.reFreshCount > 3) {
                    if (this.movableList[i] == 1) {
                        canMove.push(i);
                        leaveNum = leaveNum + 1;
                        continue;
                    }
                }
                //根据Z轴建立数组
                var mj = this.leaveList[i];
                if (this.mahjongOnZ[mj.uz] == null) {
                    this.mahjongOnZ[mj.uz] = [];
                }
                //在Z轴的基础上根据XY轴建立权重数组
                var xyVal = Math.abs(window.midX - mj.ux) + Math.abs(window.midY - mj.uy);
                if (this.mahjongOnZ[mj.uz][xyVal] == null) {
                    this.mahjongOnZ[mj.uz][xyVal] = [];
                }
                //压入数组
                this.mahjongOnZ[mj.uz][xyVal].push(i);
                leaveNum = leaveNum + 1;
            }
        } */


        for (var i = 0; i < this.leaveList.length; i = i + 1) {
            if (this.leaveList[i] != null) {
                if (this.reFreshCount > 0) {
                    if (this.movableList[i] == 1) {
                        canMove.push(i);
                        leaveNum = leaveNum + 1;
                        continue;
                    }
                }
                var mj = this.leaveList[i];
                //在Z轴的基础上根据XY轴建立权重数组
                var xyVal = Math.abs(window.midX - mj.ux) + Math.abs(window.midY - mj.uy);
                if (minVal > xyVal) {
                    minVal = xyVal;
                }
                if (maxVal < xyVal) {
                    maxVal = xyVal;
                }
                if (this.mahjongOnZ[xyVal] == null) {
                    this.mahjongOnZ[xyVal] = [];
                }
                //压入数组
                this.mahjongOnZ[xyVal].push(i);
                leaveNum = leaveNum + 1;
            }
        }

        //只剩两张却不能连的情况
        if (leaveNum == 2) {
            var j = 0;
            for (var i = 0; i < this.leaveList.length; i = i + 1) {
                if (this.leaveList[i] != null) {
                    if (j == 0) {
                        this.leaveList[i].runAction(cc.moveTo(0.5, cc.v2(-100, 100)));
                        this.leaveList[i].color = cc.color(255, 255, 255);
                        this.movableList[i] = 1;
                        j++;
                    } else {
                        this.leaveList[i].runAction(cc.moveTo(0.5, cc.v2(100, 100)));
                        this.leaveList[i].color = cc.color(255, 255, 255);
                        this.movableList[i] = 1;
                    }
                }
            }
            return 0;
        }

        //剩余牌数为零则胜利
        if (leaveNum <= 0) {
            this.scheduleOnce(function () {
                this.winAction(true);
            }.bind(this), 1.5)
            return;
        }
        //根据剩下的牌的数量生成随机的牌符号
        for (var i = 0; i < leaveNum / 2; i = i + 1) {
            var val = (i % 42) + 1;
            twain[i * 2] = val;
            twain[i * 2 + 1] = val;
        }

        //打乱
        if (canMove.length > 1) {
            canMove.sort(this.randomsort);
        }
        //特殊情况下直接给可移动的所有牌都能对上
        while (canMove.length > 0) {
            var spt = twain.pop();
            var idx = canMove.pop();
            this.curMahjongs[idx].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("" + spt);
            this.curMahjongs[idx].tag = spt;
        }

        //按照XY权重进行牌的排列
        for (var s = minVal; s <= maxVal; s = s + 1) {
            //过滤不存在的权重
            if (this.mahjongOnZ[s] != null) {
                //获取对应的数组
                var injextList = this.mahjongOnZ[s];
                //打乱
                if (injextList.length > 1) {
                    injextList.sort(this.randomsort);
                }
                //放入剩下的牌中
                for (var idx = 0; idx < injextList.length; idx = idx + 1) {
                    var spt = twain.pop();
                    this.curMahjongs[injextList[idx]].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("" + spt);
                    this.curMahjongs[injextList[idx]].tag = spt;
                }
            }
        }
        /* //Z轴循环
        for (var s = 0; s < this.mahjongOnZ.length; s = s + 1) {
            //XY权重循环
            for (var m = (window.midX + window.midY); m >= 0; m = m - 1) {
                //过滤不存在的权重
                if (this.mahjongOnZ[s][m] != null && this.mahjongOnZ[s][m].length > 0) {
                    //获取对应的数组
                    var injextList = this.mahjongOnZ[s][m];
                    //打乱
                    injextList.sort(this.randomsort);
                    //放入剩下的牌中
                    for (var idx = 0; idx < injextList.length; idx = idx + 1) {
                        var spt = twain.pop();
                        this.curMahjongs[injextList[idx]].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("" + spt);
                        this.curMahjongs[injextList[idx]].tag = spt;
                    }
                }
            }
        } */

        //随机放入牌的值
        /* leaveTag.sort(this.randomsort);
        for (var i = 0; i < this.leaveList.length; i = i + 1) {
            if (this.leaveList[i] != null) {
                this.leaveList[i].tag = leaveTag.pop();
                var frame = this.gameAtlas.getSpriteFrame("" + this.leaveList[i].tag);
                this.leaveList[i].getComponent(cc.Sprite).spriteFrame = frame;
            }
        } */

        this.checkCanBump();
    },

    //获取可以移动的麻将列表
    getCanMove() {
        var moveList = [];
        for (var i = 0; i < this.movableList.length; i = i + 1) {
            if (this.movableList[i] == 1) {
                moveList.push(i);
            }
        }
        return moveList;
    },


    shake() {
        this.tipText.node.parent.parent.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
            cc.delayTime(0.5)
        )));
    },

    tickTack() {
        this.tipText.node.parent.parent.stopAllActions();
        this.tipText.node.parent.parent.rotation = 0;
        this.unschedule(this.shake);
        this.scheduleOnce(this.shake, 5);
    },

    //绘制地图
    drawMap(map) {
        if (this.isDrawMap) {
            return;
        }
        //保存当前关
        var param = {};
        param["playingMid"] = window.mid;
        param["playingLid"] = window.lid;
        SDK().setItem(param, null);

        this.tickTack();
        this.countTime = 0;
        window.timeGiftScript.giftBtn.active = true;
        this.isDrawMap = true;
        this.isHelping = false;
        //进度条星星处理
        this.leaveStars[2].spriteFrame = this.noBrokenFrame;
        this.leaveStars[1].spriteFrame = this.noBrokenFrame;
        this.leaveStars[0].spriteFrame = this.noBrokenFrame;
        window.gameApplication.scaleUpAndDowm(this.leaveStars[2].node);
        window.gameApplication.scaleUpAndDowm(this.leaveStars[1].node);
        window.gameApplication.scaleUpAndDowm(this.leaveStars[0].node);
        //每日挑战处理
        if (window.isChallenge) {
            this.stageText.string = "Daily";
        } else {
            this.stageText.string = "Level " + ((mid - 1) * 100 + map.lid);
        }

        //开始关卡
        var levelDetail = {};
        levelDetail.level = mid + "0" + (lid > 99 ? lid : (lid > 9 ? "0" + lid : "00" + lid));
        gameApplication.DataAnalytics.levelBegin(levelDetail);

        this.selectList = [];
        this.leaveList = [];
        this.unMovableList = [];
        this.movableList = [];
        this.curMap = [];
        this.lid = map.lid;
        var mahjongs = map.mahjongs;
        if (this.curMahjongs == null) {
            this.curMahjongs = [];
        }
        //时间更新
        this.curMapTime = mahjongs.length * 3;
        this.leaveTime = this.curMapTime;

        var maxZ = 0;
        for (var i = 0; i < mahjongs.length; i = i + 1) {
            if (maxZ < mahjongs[i][2]) {
                maxZ = mahjongs[i][2];
            }
        }
        //初始化数据地图
        for (var i = -1; i <= maxZ + 1; i = i + 1) {
            this.curMap[i] = [];
            for (var j = -2; j < 40; j = j + 1) {
                this.curMap[i][j] = [];
                for (var k = -2; k < 40; k = k + 1) {
                    this.curMap[i][j][k] = [];
                    for (var l = 0; l < 2; l = l + 1) {
                        this.curMap[i][j][k][l] = [0, null];
                    }
                }
            }
        }
        for (var z = 0; z <= maxZ + 1; z = z + 1) {
            this.mahjongOnZ[z] = [];
        }
        var maxX = 0;
        var minX = 100;
        var maxY = 0;
        var minY = 100;
        //生成数据地图
        for (var i = 0; i < mahjongs.length; i = i + 1) {
            var x = mahjongs[i][0];
            var y = mahjongs[i][1];
            var z = mahjongs[i][2];
            this.curMap[z][x][y] = [1, i];
            this.curMap[z][x][y + 1] = [1, i];
            this.curMap[z][x + 1][y] = [1, i];
            this.curMap[z][x + 1][y + 1] = [1, i];
            if (x > maxX) {
                maxX = x;
            }
            if (x < minX) {
                minX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
            if (y < minY) {
                minY = y;
            }
        }
        window.midX = ((maxX + minX) / 2) + 1;
        window.midY = (maxY + minY) / 2;
        //生成麻将
        for (var i = 0; i < this.curMahjongs.length || i < mahjongs.length; i = i + 1) {
            if (i < mahjongs.length) {
                //初始化每个麻将
                if (this.curMahjongs[i] == null) {
                    this.curMahjongs[i] = cc.instantiate(this.object_prefab);
                    this.curMahjongs[i].parent = this.drawView;
                }
                this.curMahjongs[i].scale = 1;
                this.curMahjongs[i].anchorY = 0;
                this.curMahjongs[i].off(cc.Node.EventType.TOUCH_END);
                this.curMahjongs[i].on(cc.Node.EventType.TOUCH_END, function (event) {
                    this.mahjongClick(event);
                }, this);
                var uz = mahjongs[i][2];
                var uy = mahjongs[i][1];
                var ux = mahjongs[i][0];
                this.curMahjongs[i].uz = uz;
                this.curMahjongs[i].ux = ux;
                this.curMahjongs[i].uy = uy;
                this.curMahjongs[i].color = cc.color(255, 255, 255);
                this.curMahjongs[i].active = false;
                this.setMagjongPos(this.curMahjongs[i], 0.2, i);
                this.checkMahjong(this.curMahjongs[i]);
                this.leaveList[i] = this.curMahjongs[i];
            } else {
                if (this.curMahjongs[i] != null) {
                    this.curMahjongs[i].active = false;
                }
            }
        }
        //var canMove = this.getCanMove();

        this.selectAnim[0].tag = 0;
        this.selectAnim[1].tag = 0;

        //给牌赋值
        this.refreshMap();
        //检测是否有可用对
        this.checkCanBump();
        //标志位设为开始
        this.curStage = 1;
        //显示麻将组
        this.drawView.active = true;
        //设置为游戏中
        window.isPlaying = true;
        //地图绘制完成
        this.isDrawMap = false;

        window.gameTimes = window.gameTimes + 1;

        if (window.gameTimes == 5) {
            window.gameTimes = 0;
            this.goShareView.active = true;
        }
        if (this.isGuide < 3) {
            this.checkCanBump(true);
        }
        //this.winAction(false);
    },

    //麻将的点击事件
    mahjongClick(event) {
        if (cc.color(255, 255, 255).equals(event.target.color)) {
            window.gameApplication.soundManager.playSound("btn_click");
            var last = this.selectList.pop();
            if (last != null) {
                //判断是不是一样的牌
                if (last.tag == event.target.tag) {
                    last.color = cc.color(255, 255, 255);
                    event.target.color = cc.color(255, 255, 255);
                    for (var i = 0; i < 2; i = i + 1) {
                        this.selectAnim[i].tag = 0;
                        this.selectAnim[i].active = false;
                    }
                    this.backList.push([event.target, last]);
                    this.bumpDataDeul(event.target, last, 0);
                    this.bumpAnim(event.target, last);
                    this.checkCanBump();

                    //处理新手引导
                    this.isGuide = this.isGuide + 1;
                    if (this.isGuide < 3) {
                        this.checkCanBump(true);
                    }
                } else {
                    last.color = cc.color(255, 255, 255);
                    event.target.color = cc.color(255, 255, 254);
                    this.selectList.push(event.target);
                    for (var i = 0; i < 2; i = i + 1) {
                        if (this.selectAnim[i].tag == 1) {
                            this.selectAnim[i].position = event.target.position;
                            this.selectAnim[i].setLocalZOrder(event.target.getLocalZOrder());
                            var light = cc.find("selectLight", this.selectAnim[i]);
                            this.selectLightAnim(light);
                            break;
                        }
                    }
                }
            } else {
                event.target.color = cc.color(255, 255, 254);
                for (var i = 0; i < 2; i = i + 1) {
                    if (this.selectAnim[i].tag == 0) {
                        this.selectAnim[i].tag = 1;
                        this.selectAnim[i].position = event.target.position;
                        this.selectAnim[i].setLocalZOrder(event.target.getLocalZOrder());
                        this.selectAnim[i].active = true;
                        var light = cc.find("selectLight", this.selectAnim[i]);
                        this.selectLightAnim(light);
                        break;
                    }
                }
                this.selectList.push(event.target);
            }
        }
    },

    selectLightAnim(light) {
        light.stopAllActions();
        light.scaleX = -2;
        light.scaleY = 2;
        light.runAction(cc.scaleTo(0.2, -1, 1));
    },

    //根据属性设置麻将的位置
    setMagjongPos(mahjong, during, i) {
        mahjong.rotation = 0;
        let uz = mahjong.uz;
        let ux = mahjong.ux;
        let uy = mahjong.uy;
        mahjong.setLocalZOrder((uz * 100) - uy - ux);
        let xVal = 20 + ((ux - window.midX) * 62 * 0.5) + (uz * 5);
        let yVal = -44 + ((uy - window.midY) * 88 * 0.5) + (uz * 5);
        mahjong.stopAllActions();
        mahjong.position = cc.v2(xVal, yVal + 1000);
        this.curMahjongs[i].active = true;
        this.scheduleOnce(function () {
            this.curMahjongs[i].runAction(cc.sequence(
                cc.moveTo(during, cc.v2(xVal, yVal)),
                cc.callFunc(function () {
                    window.gameApplication.soundManager.playSound("blockDown");
                }.bind(this), this)
            ));
        }.bind(this), i * 0.02)

    },


    //碰的数据处理
    bumpDataDeul(l, r, val) {
        this.tickTack();
        if (this.isHelping) {
            if (this.curHelpIdx[0] == this.curMap[l.uz][l.ux][l.uy][1] || this.curHelpIdx[1] == this.curMap[l.uz][l.ux][l.uy][1]) {
                this.isHelping = false;
                this.curMahjongs[this.curHelpIdx[0]].stopAllActions();
                this.curMahjongs[this.curHelpIdx[1]].stopAllActions();
            }
            if (this.curHelpIdx[0] == this.curMap[r.uz][r.ux][r.uy][1] || this.curHelpIdx[1] == this.curMap[r.uz][r.ux][r.uy][1]) {
                this.isHelping = false;
                this.curMahjongs[this.curHelpIdx[0]].stopAllActions();
                this.curMahjongs[this.curHelpIdx[1]].stopAllActions();
            }
        }
        l.stopAllActions();
        r.stopAllActions();
        l.rotation = 0;
        r.rotation = 0;
        if (val == 0) {
            //卸载点击事件
            l.off(cc.Node.EventType.TOUCH_END);
            r.off(cc.Node.EventType.TOUCH_END);
            //可移动列表更新
            this.movableList[this.curMap[l.uz][l.ux][l.uy][1]] = 0;
            this.movableList[this.curMap[r.uz][r.ux][r.uy][1]] = 0;
            //不可以动列表更新
            this.unMovableList[this.curMap[l.uz][l.ux][l.uy][1]] = 1;
            this.unMovableList[this.curMap[r.uz][r.ux][r.uy][1]] = 1;
            //剩余列表更新
            this.leaveList[this.curMap[l.uz][l.ux][l.uy][1]] = null;
            this.leaveList[this.curMap[r.uz][r.ux][r.uy][1]] = null;
        } else {
            //绑定点击事件
            l.on(cc.Node.EventType.TOUCH_END, function (event) {
                this.mahjongClick(event);
            }, this);
            r.on(cc.Node.EventType.TOUCH_END, function (event) {
                this.mahjongClick(event);
            }, this);
            //可移动列表更新
            this.movableList[this.curMap[l.uz][l.ux][l.uy][1]] = 1;
            this.movableList[this.curMap[r.uz][r.ux][r.uy][1]] = 1;
            //不可以动列表更新
            this.unMovableList[this.curMap[l.uz][l.ux][l.uy][1]] = 0;
            this.unMovableList[this.curMap[r.uz][r.ux][r.uy][1]] = 0;
            //剩余列表更新
            this.leaveList[this.curMap[l.uz][l.ux][l.uy][1]] = this.curMahjongs[this.curMap[l.uz][l.ux][l.uy][1]];
            this.leaveList[this.curMap[r.uz][r.ux][r.uy][1]] = this.curMahjongs[this.curMap[r.uz][r.ux][r.uy][1]];
        }
        this.curMap[l.uz][l.ux][l.uy][0] = val;
        this.curMap[l.uz][l.ux][l.uy + 1][0] = val;
        this.curMap[l.uz][l.ux + 1][l.uy][0] = val;
        this.curMap[l.uz][l.ux + 1][l.uy + 1][0] = val;
        this.curMap[r.uz][r.ux][r.uy][0] = val;
        this.curMap[r.uz][r.ux][r.uy + 1][0] = val;
        this.curMap[r.uz][r.ux + 1][r.uy][0] = val;
        this.curMap[r.uz][r.ux + 1][r.uy + 1][0] = val;
        //检查碰对的两个周围是否有亮
        this.checkAround(l);
        this.checkAround(r);
    },

    //碰动画
    bumpAnim(l, r) {
        if (l.ux > r.ux) {
            var t = l;
            l = r;
            r = t;
        }
        l.setLocalZOrder(1001);
        r.setLocalZOrder(1000);
        var wSize = cc.winSize.width / 2;
        var hSize = cc.winSize.height / 2;
        var fix;
        if (l.uy > window.midY) {
            fix = 100;
        } else {
            fix = -100;
        }
        var bezier = [cc.p(-200, fix), cc.p(-150, 0), cc.v2(-105, -49.5)];
        l.runAction(cc.sequence(
            cc.bezierTo(0.6, bezier),
            cc.delayTime(0.05),
            //移动特效
            cc.callFunc(function () {
                this.boomAnim.node.active = true;
                this.boomAnim.playSprites("boomAnim", 5, 0, 1, 30, true, false, null, function () {
                    this.boomAnim.node.active = false;
                }.bind(this));
            }.bind(this), this),
            cc.moveTo(0.1, cc.v2(-32, -49.5)),
            //碰撞效果
            cc.callFunc(function () {
                window.gameApplication.soundManager.playSound("boom");
                this.boomAnim1.node.active = true;
                this.boomAnim1.playSprites("boomEnd", 3, 0, 1, 15, true, false, null, function () {
                    this.boomAnim1.node.active = false;
                }.bind(this));
            }.bind(this), this),
            cc.delayTime(0.1),
            //消失特效
            cc.callFunc(function () {
                l.scale = 0;
                r.scale = 0;
                this.boomBg.node.active = true;
                this.boomBg.playSprites("boomBg", 8, 0, 1, 20, true, false, null, function () {
                    this.boomBg.node.active = false;
                }.bind(this));
            }.bind(this), this),
        ));
        if (r.uy > window.midY) {
            fix = 100;
        } else {
            fix = -100;
        }
        bezier = [cc.p(200, fix), cc.p(150, 0), cc.v2(105, -49.5)];
        r.runAction(cc.sequence(
            cc.bezierTo(0.6, bezier),
            cc.delayTime(0.05),
            cc.moveTo(0.1, cc.v2(32, -49.5)),
        ));
    },

    brokenBoom(target, brokenFrame) {
        this.brokenBoomAnim.position = target.node.position;
        this.brokenBoomAnim.active = true;
        this.brokenBoomAnim.getComponent("SpriteAnimation").playSprites("crash", 7, 0, 1, 14, true, false, null, function () {
            this.brokenBoomAnim.active = false;
        }.bind(this));
        target.spriteFrame = brokenFrame;
        target.node.stopAllActions();
        target.node.scale = 1;
    },

    //检查自己周围
    checkAround(mahjong) {
        let uz = mahjong.uz;
        let ux = mahjong.ux;
        let uy = mahjong.uy;
        //正下方
        if (uz > 0) {
            this.checkMahjong(this.curMahjongs[this.curMap[uz - 1][ux][uy][1]]);;
            this.checkMahjong(this.curMahjongs[this.curMap[uz - 1][ux + 1][uy][1]]);;
            this.checkMahjong(this.curMahjongs[this.curMap[uz - 1][ux][uy + 1][1]]);;
            this.checkMahjong(this.curMahjongs[this.curMap[uz - 1][ux + 1][uy + 1][1]]);;
        }
        //左边
        this.checkMahjong(this.curMahjongs[this.curMap[uz][ux - 1][uy][1]]);;
        this.checkMahjong(this.curMahjongs[this.curMap[uz][ux - 1][uy + 1][1]]);;
        //右边
        this.checkMahjong(this.curMahjongs[this.curMap[uz][ux + 2][uy][1]]);;
        this.checkMahjong(this.curMahjongs[this.curMap[uz][ux + 2][uy + 1][1]]);;
    },

    //检测是否可移动
    checkMahjong(mahjong) {
        //没有麻将或者该麻将已经被碰就直接返回
        if (mahjong == null || this.curMap[mahjong.uz][mahjong.ux][mahjong.uy][0] == 0) {
            return;
        }
        let uz = mahjong.uz;
        let ux = mahjong.ux;
        let uy = mahjong.uy;
        let i = this.curMap[uz][ux][uy][1];
        switch (1) {
            //自身上方是否有麻将
            case this.curMap[uz + 1][ux][uy][0]:
            case this.curMap[uz + 1][ux + 1][uy][0]:
            case this.curMap[uz + 1][ux][uy + 1][0]:
            case this.curMap[uz + 1][ux + 1][uy + 1][0]: {
                this.curMahjongs[i].color = cc.color(125, 125, 125);
                this.unMovableList[i] = 1;
                this.movableList[i] = 0;
            } break;
            default: {
                //自身的左边或右边是否有麻将
                if ((this.curMap[uz][ux - 1][uy][0] != 1 && this.curMap[uz][ux - 1][uy + 1][0] != 1) || (this.curMap[uz][ux + 2][uy][0] != 1 && this.curMap[uz][ux + 2][uy + 1][0] != 1)) {
                    this.curMahjongs[i].color = cc.color(255, 255, 255);
                    this.unMovableList[i] = 0;
                    this.movableList[i] = 1;
                } else {
                    this.curMahjongs[i].color = cc.color(125, 125, 125);
                    this.unMovableList[i] = 1;
                    this.movableList[i] = 0;
                }
            }
        }
    },



    update(dt) {
        if (this.curStage == 1 && window.isPlaying) {
            this.leaveTime = this.leaveTime - dt;
            this.progress.progress = this.leaveTime / this.curMapTime;
            if (this.progress.progress < 0.5 && this.leaveStars[2].spriteFrame != this.brokenFrame) {
                this.brokenBoom(this.leaveStars[2], this.brokenFrame);
            } else if (this.progress.progress < 0.25 && this.leaveStars[1].spriteFrame != this.brokenFrame) {
                this.brokenBoom(this.leaveStars[1], this.brokenFrame);
            } else if (this.progress.progress < 0.01 && this.leaveStars[0].spriteFrame != this.brokenFrame) {
                this.brokenBoom(this.leaveStars[0], this.brokenFrame);
                this.winAction(false);
            }
        }
        if (this.leaveTime <= 10 && this.warn.active == false && this.curStage == 1) {
            this.warn.active = true;
            this.warn.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5))));
        }

        var passTime = this.curMapTime - this.leaveTime;
        passTime = Math.floor(passTime);
        if (passTime % 80 == 0 && this.countTime != passTime) {
            this.countTime = passTime;
            SDK().showInterstitialAd(function (isCompleted) {
                console.log("播放Done");
            }, false);
        }
    },

    //加载榜单
    LoadRank() {
        SDK().getFriendsInfo(function (list) {
            this.GetFriendRank(list);
        }.bind(this));
        SDK().getRank(2, 20, 0, function (list) {
            this.GetWorldRank(list);
        }.bind(this));
    },

    //好友邀请列表
    GetFriendRank(list) {
        this.friendPlayer = list;
        for (var i = 0; i < this.friendPlayer.length; i = i + 1) {
            var playerBar;
            var Head;
            var Name;
            if (i >= this.friendUIPlayer.length) {
                playerBar = cc.instantiate(this.prefab_player);
                Head = playerBar.getChildByName("Mask").getChildByName("Head").getComponent(cc.Sprite);
                Name = playerBar.getChildByName("Name").getComponent(cc.Label);
                var No = playerBar.getChildByName("No");
                var Score = playerBar.getChildByName("Num");
                No.active = false;
                Score.active = false;
                this.friendUIPlayer[i] = {};
                this.friendUIPlayer[i].playerBar = playerBar;
                this.friendUIPlayer[i].Head = Head;
                this.friendUIPlayer[i].Name = Name;
            } else {
                playerBar = this.friendUIPlayer[i].playerBar;
                Head = this.friendUIPlayer[i].Head;
                Name = this.friendUIPlayer[i].Name;
            }
            var playBtn = playerBar.getChildByName("Play");
            Name.node.active = true;
            playerBar.name = this.friendPlayer[i].id;
            var self = this;
            let id = this.friendPlayer[i].id
            playBtn.off(cc.Node.EventType.TOUCH_END);
            playBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                window.gameApplication.soundManager.playSound("btn_click");
                SDK().playWith(id, self.highestScore, function (isCompleted) {
                    window.gameApplication.openMainView(true);
                }.bind(this));

            }, this);
            Name.string = this.friendPlayer[i].name;
            playerBar.parent = this.friendContent;
            //加载头像
            this.LoadSprite(this.friendPlayer[i].headUrl, Head, this.headSpriteList[this.friendPlayer[i].id]);
        }
        if (this.friendPlayer.length < this.friendUIPlayer.length) {
            for (var i = this.friendPlayer.length; i < this.friendUIPlayer.length; i = i + 1) {
                this.friendUIPlayer[i].playerBar.active = false;
            }
        }
    },

    //世界排行榜
    GetWorldRank(list) {
        this.worldPlayer = list;
        //如果自己不在榜单上就将自己加载最后
        SDK().getRankScore(2, function (info) {
            if (info != null) {
                this.LoadRankData(0, info);
                for (var i = 1; i <= this.worldPlayer.length; i = i + 1) {
                    this.LoadRankData(i, this.worldPlayer[i - 1]);
                }
            }
            var listLength = this.worldPlayer.length;
            //隐藏多余的榜单
            if (listLength + 1 < this.worldUIPlayer.length) {
                for (var i = this.worldPlayer.length; i < this.worldUIPlayer.length; i = i + 1) {
                    this.worldUIPlayer[i].playerBar.active = false;
                }
            }
        }.bind(this))
    },

    //将玩家信息加载到第I排
    LoadRankData(i, playerData) {
        var isOnRank = false;
        var playerBar;
        var mainBg;
        var No;
        var Score;
        var Head;
        if (i >= this.worldUIPlayer.length) {
            playerBar = cc.instantiate(this.prefab_player);
            mainBg = playerBar.getComponent(cc.Sprite);
            No = playerBar.getChildByName("No").getComponent(cc.Label);
            Score = playerBar.getChildByName("Num").getComponent(cc.Label);
            Head = playerBar.getChildByName("Mask").getChildByName("Head").getComponent(cc.Sprite);
            var Name = playerBar.getChildByName("Name");
            Name.active = false;
            this.worldUIPlayer[i] = {};
            this.worldUIPlayer[i].playerBar = playerBar;
            this.worldUIPlayer[i].mainBg = mainBg;
            this.worldUIPlayer[i].No = No;
            this.worldUIPlayer[i].Score = Score;
            this.worldUIPlayer[i].Head = Head;
        } else {
            playerBar = this.worldUIPlayer[i].playerBar;
            mainBg = this.worldUIPlayer[i].mainBg;
            No = this.worldUIPlayer[i].No;
            Score = this.worldUIPlayer[i].Score;
            Head = this.worldUIPlayer[i].Head;
        }
        No.node.active = true;
        Score.node.active = true;
        playerBar.name = playerData.id;
        playerBar.parent = this.worldContent;
        //是否为自己
        if (playerData.id == SDK().getSelfInfo().id && i != 0) {
            //mainBg.spriteFrame = this.rankAtlas.getSpriteFrame("bg1");
            playerBar.active = false;
        } else {
            //this.worldUIPlayer[i].mainBg = playerBar.getComponent(cc.Sprite);
            //this.worldUIPlayer[i].mainBg.spriteFrame = this.rankAtlas.getSpriteFrame("barBg");
        };
        //隐藏play按钮
        var playBtn = playerBar.getChildByName("Play");
        playBtn.active = false;
        //加载名次
        No.string = "No:" + playerData.no;
        //加载分数
        Score.string = playerData.score;
        //加载头像
        this.LoadSprite(playerData.headUrl, Head, this.headSpriteList[playerData.id]);
    },

    //根据URL加载头像并到对应的sprite上
    LoadSprite(url, sprite, saver) {
        if (saver == null) {
            cc.loader.load(url, function (err, texture) {
                saver = new cc.SpriteFrame(texture);
                sprite.spriteFrame = saver;
            });
        } else {
            sprite.spriteFrame = saver;
        }

    },


});
