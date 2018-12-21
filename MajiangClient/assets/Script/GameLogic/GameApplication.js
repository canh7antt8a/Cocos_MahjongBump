var Player = require("../GameLogic/Player");
var SoundManager = require("../GameLogic/SoundManager");
var ViewManager = require("../GameLogic/ViewManager");
var DataAnalytics = require("../SDK/DataAnalytics");
var MainView = require("../UI/MainView");
var LevelView = require("../UI/LevelView");

cc.Class({
    extends: cc.Component,

    properties: {
        viewManager: {
            default: null,
            type: ViewManager,
        },
        soundManager: {
            default: null,
            type: SoundManager,
        },
        missions: {
            default: []
        },
        missionsCB: {
            default: []
        },
        conf: {
            default: {},
        },
        confCB: {
            default: []
        },
        VideoView: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        VideoView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        fbView: {
            default: null,
            type: cc.Node,
            visible: false,
        },
        fbView_prefab: {
            default: null,
            type: cc.Prefab,
        },
        object_prefab: {
            default: null,
            type: cc.Prefab,
        },
        viewAtlas: {
            default: null,
            type: cc.SpriteAtlas,
        },
        curLang: {
            get: function () {
                return window.i18n.curLang;
            }
        },
        _playTimes: {
            default: 0,
            type: cc.Integer,
        },
        playTimes: {
            get: function () {
                return this._playTimes;
            },
            set: function (val) {
                SDK().plusPlayTimes();
                /* this._playTimes = val;
                //播放插屏广告条件判断
                if ((this._playTimes > 1 && this._playTimes % SDK().getInterstitialCount() == 0 && this._playTimes >= SDK().getInterstitialCount()) || (SDK().getInterstitialCount() <= 1 && this._playTimes > 1)) {
                    console.log("播放插屏广告");
                    var delayTime = 0.2 + Math.random();
                    this.scheduleOnce(function () {
                        SDK().showInterstitialAd(function (isCompleted) {
                            console.log("播放Done");
                        }, false);
                    }, delayTime);

                    SDK().canCreateShortcutAsync();
                }

                if (this._playTimes == 1) {
                    SDK().shareBestScore("all", null);
                } */
            },
        },
        popGameView: {
            default: null,
            type: cc.Node,
        },
    },

    start() {
        SDK().init(function () {
            DataAnalytics.login(SDK().getSelfInfo().id);
            var levelDetail = {};
            levelDetail.level = "gameStart"
            gameApplication.DataAnalytics.levelBegin(levelDetail);
        }.bind(this));

        //处理第一次进入游戏
        SDK().getItem("playingMid", function (mid) {
            if (mid == 0 || mid == undefined || mid == null) {
                mid = 1;
            }
            SDK().getItem("playingLid", function (lid) {
                if (lid == 0 || lid == undefined || lid == null) {
                    lid = 1;
                }
                window.bid = 1;
                window.mid = mid;
                window.lid = lid;
                window.isGoPlay = true;
                window.isChallenge = false;
                this.openGameView(true);
            }.bind(this));
        }.bind(this));
    },

    getConf(path, cb) {

        if (this.conf[path] != null) {
            if (cb) {
                // cc.log("从cache读取："+path)
                cb(this.conf[path]);
            }
        } else {
            // cc.log("从硬盘读取："+path)
            cc.loader.loadRes(path, function (err, results) {
                this.conf[path] = results;
                if (cb != null) {
                    cb(results)
                }
            }.bind(this));
        }
    },

    //互推按钮时间
    popClick(event, type) {
        SDK().switchGameAsync(type);
    },


    onLoad() {
        const i18n = require('LanguageData');
        i18n.init('zh');

        this.DataAnalytics = DataAnalytics;
        DataAnalytics.init()

        window.gameApplication = this;
        cc.game.addPersistRootNode(this.node);
        // this.audioSource.play();
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
        manager.enabledDrawBoundingBox = false;

        //Load Json
        cc.loader.loadRes("conf/missions", function (err, results) {
            this.missions = results;
            this.invokeMissionCB();
        }.bind(this));

        this.openMissionView(true);
        this.openDailyView(true);
        this.openBeginView(true);


        window.gameTimes = 1;
    },

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
        levelDetail.level = "gameStart";
        levelDetail.reason = ""
        gameApplication.DataAnalytics.levelResult(true, levelDetail);
        DataAnalytics.logout(SDK().getSelfInfo().id);
    },

    getMissions(cb) {
        if (this.missions != null && this.missions.length > 0) {
            cb(this.missions);
        } else {
            this.missionsCB.push(cb);
        }
    },

    invokeMissionCB() {
        var self = this;
        if (this.missionsCB.length > 0) {
            this.missionsCB.forEach(function (cb) {
                if (cb != null) {
                    cb(self.missions);
                }
            });
        }
    },

    setNodeActive(nodePath, active, independent, delayTime = 0) {
        var view = cc.find("Canvas/" + nodePath);
        if (view != null) {
            this.viewManager.showView(view, 0.5, active, independent, delayTime);
            var Script = view.getComponent(nodePath);
            if (Script != null) {
                if (Script.initView != null) {
                    Script.initView();
                }
            } else {
                console.log(nodePath + " have not Script!");
            }
        } else {
            console.log(nodePath + " is no exist!");
        }
    },

    closeCurView() {
        window.gameApplication.soundManager.playSound("btn_click");
        this.viewManager.closeCurView();
    },

    openBeginView: function (isOpen) {
        this.setNodeActive("BeginView", isOpen, true);
    },

    openMainView: function (isOpen) {
        this.setNodeActive("MainView", isOpen, true);
    },

    openLevelView: function (bid, mid, mission, isOpen) {
        this.setNodeActive("LevelView", isOpen, true);
        cc.find("Canvas/LevelView").getComponent("LevelView").init(bid, mid, mission);
    },

    openMissionView: function (isOpen) {
        this.setNodeActive("MissionView", isOpen, false);
    },

    openEndView: function (isOpen) {
        this.setNodeActive("EndView", isOpen, false);
    },

    openDailyView: function (isOpen) {
        window.gameApplication.soundManager.playSound("btn_click");
        this.setNodeActive("DailyView", isOpen, false);
    },

    openGiftView: function (isOpen) {
        this.setNodeActive("GiftView", isOpen, false);
    },

    /* openMenuView: function (isOpen) {
        this.setNodeActive("MenuView", true, false);
    }, */

    openGameView: function (isOpen) {
        this.setNodeActive("GameView", true, true);
    },

    //game场景回到level场景
    gamingBackToLevel(bid, mid) {
        this.openLevelView(bid, mid, this.missions[mid - 1], true);
    },

    //game场景回到main场景
    gamingBackToMian(bid, mid) {
        this.openMainView(true);
    },

    //开始挑战
    goChallenge() {
        this.openGameView(true);
        /* this.scheduleOnce(function () {
            this.openMenuView(true);
        }.bind(this), 0.3) */
    },

    //显示是否观看视频的提示框
    showVideoView(cb) {
        if (this.VideoView == null) {
            var view = cc.instantiate(this.VideoView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.VideoView = view;
        }
        this.VideoView.active = true;
        let light = this.VideoView.getChildByName("Bg").getChildByName("BorderBg4").getChildByName("TipShape").getChildByName("LightSmall");
        light.stopAllActions();
        light.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5), cc.delayTime(0.1))));
        let sureBtn = this.VideoView.getChildByName("Bg").getChildByName("Sure");
        sureBtn.off(cc.Node.EventType.TOUCH_END);
        sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            this.onVideoBtnClick(cb);
            this.VideoView.active = false;
        }, this);

        var laterBtn = this.VideoView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            cb(false);
            this.VideoView.active = false;
        }, this);
    },

    //视频奖励
    onVideoBtnClick(cb) {
        SDK().showVideoAd(
            function (isCompleted) {
                if (null == isCompleted) {
                    console.log("没有观看成功")
                    this.fbFail(1);
                    cb(false);
                } else if (isCompleted) {
                    cb(true);
                } else {
                    console.log("没有观看成功")
                    this.fbFail(1);
                    cb(false);
                }
            }.bind(this)
        );
    },

    //插屏奖励
    onGiftBtnClick(cb) {
        cb(true);
        return;
        SDK().showInterstitialAd(
            function (isCompleted) {
                if (null == isCompleted) {
                    console.log("没有观看成功")
                    this.fbFail(1);
                    cb(false);
                } else if (isCompleted) {
                    cb(true);
                } else {
                    console.log("没有观看成功")
                    this.fbFail(1);
                    cb(false);
                }
            }.bind(this)
            , true);
    },

    //分享
    onShareBtnClick(score) {
        SDK().share(score, function (isCompleted) {
            if (isCompleted) {//分享激励
                console.log("share:" + score);
                window.misstionScript.checkMission(1, true);
                window.misstionScript.checkMission(0, false);
            } else {
                this.fbFail(2);
            }
        }.bind(this));
    },

    fbFail(type) {
        var view = cc.instantiate(this.fbView_prefab);
        var Canvas = cc.find("Canvas");
        view.parent = Canvas;
        view.width = window.width;
        view.height = window.height;
        var btn = view.getChildByName("Okay");
        btn.off(cc.Node.EventType.TOUCH_END);
        btn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            this.fbView.active = false;
            btn.parent.destroy();
        }, this);
        this.fbView = view;
        if (type == 1) {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = true;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = false;
        } else {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = false;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = true;
        }
        this.fbView.active = true;
        this.fbView.setLocalZOrder(101);

    },

    //获得提示动画
    flyTipAnim(num) {
        let reward = cc.instantiate(this.object_prefab);
        reward.getComponent(cc.Sprite).spriteFrame = this.viewAtlas.getSpriteFrame("hintBig");
        reward.parent = cc.find("Canvas");
        reward.position = cc.v2(0, 0);
        reward.runAction(cc.sequence(
            cc.moveBy(1, cc.v2(0, 400)).easing(cc.easeIn(2)),
            cc.callFunc(function () {
                reward.destroy();
            }),
        ));
    },

    shake(node) {
        node.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.1, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, -5).easing(cc.easeIn(2)),
            cc.rotateTo(0.2, 5).easing(cc.easeIn(2)),
            cc.rotateTo(0.1, 0).easing(cc.easeIn(2)),
            cc.delayTime(0.5)
        )));
    },

    scaleUpAndDowm(node, isShining, light) {
        node.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2)),
            cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
            cc.scaleTo(0.6, 1.1).easing(cc.easeIn(2)),
            cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)),
        )));
        if (isShining) {
            light.runAction(cc.repeatForever(cc.sequence(
                cc.fadeIn(0.3).easing(cc.easeIn(2)),
                cc.fadeOut(0.6).easing(cc.easeIn(2)),
                cc.fadeIn(0.6).easing(cc.easeIn(2)),
                cc.fadeOut(0.6).easing(cc.easeIn(2)),
            )))
        }
    },


    shadowFadeOutAnim(node, scal, during, isRepeat) {
        node.stopAllActions();
        let shadow = node.getChildByName("Shadow");
        shadow.active = true;
        shadow.scale = 1;
        shadow.opacity = 255;
        if (isRepeat) {
            shadow.runAction(cc.repeatForever(cc.sequence(cc.spawn(
                cc.scaleTo(during, scal),
                cc.fadeOut(during).easing(cc.easeOut(2))
            ), cc.callFunc(function () {
                shadow.scale = 1;
                shadow.opacity = 255;
                shadow.active = true;
            }, this))));
        } else {
            shadow.runAction(cc.spawn(cc.scaleTo(during, scal), cc.fadeOut(during).easing(cc.easeOut(2))));
        }

    },

    upAndScale(node, scal, during) {
        node.stopAllActions();
        node.y = -190;
        node.scale = 0.2;
        node.opacity = 255;
        node.active = true;
        node.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(during, cc.v2(0, 200)),
                cc.scaleTo(during, scal),
            ),
            cc.delayTime(0.5),
            cc.fadeOut(0.5).easing(cc.easeOut(2)),
        ))
    },


    //根据URL加载头像并到对应的sprite上
    LoadSprite(url, sprite, saver, size) {
        if (saver == null) {
            cc.loader.load(url, function (err, texture) {
                saver = new cc.SpriteFrame(texture);
                sprite.spriteFrame = saver;
                if (size != null) {
                    sprite.node.width = size.x;
                    sprite.node.height = size.y;
                }
            });
        } else {
            sprite.spriteFrame = saver;
            if (size != null) {
                sprite.node.width = size.x;
                sprite.node.height = size.y;
            }
        }

    },

    onQuitBtnClick: function () {
        // console.log("用户中途退出");
    },

    // update (dt) {},
});
