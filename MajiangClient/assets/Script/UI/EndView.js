// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var spriteAnimation = require("../UI/SpriteAnimation");
var angleToRadian = 2 * Math.PI / 360;
cc.Class({
    extends: cc.Component,

    properties: {
        reward: {
            default: null,
            type: cc.Node,
        },
        rewardBgLight: {
            default: null,
            type: cc.Node,
        },
        boomFlower: {
            default: null,
            type: cc.Node,
        },
        FlowerList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        tickerList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        maskList: {
            default: [],
            type: [cc.Animation],
        },
        whiteList: {
            default: [],
            type: [cc.Node],
        },
        backBtn: {
            default: null,
            type: cc.Node,
        },
        giftAnim: {
            default: null,
            type: spriteAnimation,
        },
        giftBtn: {
            default: null,
            type: cc.Node,
        },
        giftBtnLight: {
            default: null,
            type: cc.Node,
        },
        nextBtn: {
            default: null,
            type: cc.Node,
        },
        adSprite: {
            default: null,
            type: cc.Sprite,
        },
        adSaver: {
            default: null,
            visible: false,
        },
        titel: {
            default: null,
            type: cc.Node,
        },
        titel2: {
            default: null,
            type: cc.Node,
        },
        stars: {
            default: [],
            type: [cc.Node],
        },
        timeLable: {
            default: null,
            type: cc.Label,
        },
        starLable: {
            default: null,
            type: cc.Label,
        },
        lightBoom: {
            default: null,
            type: cc.Animation,
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
        prefab_player: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.initData();
        SDK().getRecommendGames(1, function (isOK, res) {
            if (null != res.data.rows[0].pic5 && "" != res.data.rows[0].pic5) {
                window.gameApplication.LoadSprite(res.data.rows[0].pic5, this.adSprite, this.adSaver, cc.v2(this.adSprite.node.width, this.adSprite.node.height));
                this.adSprite.node.off(cc.Node.EventType.TOUCH_END);
                this.adSprite.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    SDK().switchGameAsync(res.data.rows[0].game_id);
                }, this);
            }
        }.bind(this));
        gameApplication.popGameView.active = true;
    },

    onDisable(){
        gameApplication.popGameView.active = false;
    },

    // onLoad () {},

    start() {
        
    },

    btnClick(event, type) {
        //榜单界面
        if ("WorldRank" == type) {
            this.GetWorldRank(this.worldPlayer);
            this.worldList.active = true;
            this.worldBtn.active = true;
            this.friendList.active = false;
            this.friendBtn.active = false;
        } else if ("FriendRank" == type) {
            //SDK().shareBestScore3Times("all");
            this.GetFriendRank(this.friendPlayer);
            this.worldList.active = false;
            this.worldBtn.active = false;
            this.friendList.active = true;
            this.friendBtn.active = true;
        }
        //看插屏获得提示
        else if ("Gift" == type) {
            window.gameApplication.onGiftBtnClick(function (isCompleted) {
                if (isCompleted) {
                    this.giftBtn.stopAllActions();
                    this.giftBtnLight.stopAllActions();
                    this.giftBtn.scale = 1;
                    this.giftBtnLight.opacity = 0;
                    SDK().getItem("tips", function (tip) {
                        window.gameApplication.soundManager.playSound("parBoom");
                        tip = tip + 2;
                        SDK().setItem({ tips: tip }, null);
                        this.giftAnim.playSprites("gift_", 13, 0, 1, 10, false, false);
                        this.scheduleOnce(function () {
                            this.boomFlowerAction();
                        }.bind(this), 0.5);
                        window.tipText.string = tip;
                    }.bind(this));
                }
            }.bind(this));
        }
        else if ("Back" == type) {
            if (window.isChallenge) {
                window.gameApplication.openDailyView(true);
            } else {
                window.gameApplication.gamingBackToLevel(window.bid, window.mid);
            }
        }
    },

    boomFlowerAction() {
        this.boomFlower.active = true;
        for (var i = 0; i < 33; i = i + 1) {
            if (this.FlowerList[i] == null) {
                this.FlowerList[i] = this.boomFlower.getChildByName("Chip" + i);
            }
            this.boomFlowerAnim(this.FlowerList[i]);
        }
        for (var i = 0; i < 21; i = i + 1) {
            if (this.tickerList[i] == null) {
                this.tickerList[i] = this.boomFlower.getChildByName("TickerTape" + i);
            }
            this.boomTickerAnim(this.tickerList[i]);
        }
        window.gameApplication.upAndScale(this.reward, 1, 1);
        this.rewardBgLight.runAction(cc.repeatForever(cc.rotateBy(4, 360)));
    },

    boomFlowerAnim(node) {
        node.stopAllActions();
        node.position = cc.v2(0, 0);
        node.opacity = 255;
        var h = 400 + cc.random0To1() * 200;
        var bh = -h * 1 + cc.random0To1();
        var w = cc.randomMinus1To1() * 300;
        node.runAction(cc.spawn(
            cc.moveBy(3, cc.v2(w, 0)).easing(cc.easeOut(2)),
            cc.sequence(
                cc.moveBy(1.5, cc.v2(0, h)).easing(cc.easeOut(2)),
                cc.spawn(
                    cc.moveBy(1.5, cc.v2(0, bh)).easing(cc.easeIn(2)),
                    cc.fadeOut(1.5).easing(cc.easeIn(2)),
                ),
            )
        ));
    },

    boomTickerAnim(node) {
        node.stopAllActions();
        node.height = 0;
        node.position = cc.v2(0, 0);
        node.opacity = 255;
        var h = 400 + cc.random0To1() * 200;
        var w = cc.randomMinus1To1() * 400;
        var ro = Math.atan2(w, h) / angleToRadian;
        node.rotation = ro;
        node.getComponent(cc.Animation).play();
        node.runAction(cc.spawn(
            cc.moveBy(1.5, cc.v2(w, 0)).easing(cc.easeOut(2)),
            cc.moveBy(1.5, cc.v2(0, h)).easing(cc.easeOut(1)),
            cc.fadeOut(1.5).easing(cc.easeIn(3)),
        ));
    },

    crashAnim(node, i) {
        node.active = true;
        this.scheduleOnce(function () {
            node.runAction(cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.5),
                    cc.scaleTo(0.4, 1).easing(cc.easeIn(3)),
                ),
                cc.callFunc(function () {
                    if (i == 1) {
                        this.lightBoom.node.scale = 2;
                    } else {
                        this.lightBoom.node.scale = 1.5;
                    }
                    this.lightBoom.node.position = node.position;
                    this.lightBoom.play();
                    window.gameApplication.soundManager.playSound("" + (i + 1));
                }.bind(this), this),
            ));
        }.bind(this), i * 0.5)
    },

    initData() {
        this.boomFlower.active = false;
        this.giftAnim.playSpriteByName("gift_", 0);

        var time = window.useTime;
        var min = Math.floor(time / 100);
        var second = Math.floor(time % 100)
        if (time != 0 && time != null) {
            this.timeLable.string = min + ":" + (second >= 10 ? second : "0" + second);
        } else {
            this.timeLable.string = "--:--"
        }
        var lightBg0 = this.node.getChildByName("Light0");
        var lightBg1 = this.node.getChildByName("Light1");
        this.stars[0].opacity = 0;
        this.stars[1].opacity = 0;
        this.stars[2].opacity = 0;
        this.stars[0].scale = 5;
        this.stars[1].scale = 5;
        this.stars[2].scale = 5;
        if (window.isWin) {
            window.gameApplication.soundManager.playSound("winGame");
            for (var i = 0; i < 3; i = i + 1) {
                this.maskList[i].node.active = false;
                this.whiteList[i].opacity = 0;
            }
            this.giftBtn.active = true;
            this.scheduleOnce(function(){
                this.backBtn.x = -195;
                this.backBtn.active = false;
            }.bind(this),0.3)
            this.nextBtn.active = true;
            this.titel.active = true;
            this.titel2.active = false;
            lightBg0.active = true;
            lightBg1.active = true;
            lightBg1.runAction(cc.repeatForever(cc.rotateBy(4, 360)));
            for (var i = 0; i < window.score; i = i + 1) {
                this.crashAnim(this.stars[i], i);
            }
        } else {
            window.gameApplication.soundManager.playSound("failGame");
            for (var i = 0; i < 3; i = i + 1) {
                this.maskList[i].node.active = true;
                this.maskList[i].play();
                this.whiteList[i].opacity = 255;
                this.whiteList[i].runAction(cc.fadeOut(1).easing(cc.easeIn(3)));
            }
            this.giftBtn.active = false;
            this.scheduleOnce(function(){
                this.backBtn.x = 0;
                this.backBtn.active = true;
            }.bind(this),0.3)
            this.nextBtn.active = false;
            this.titel.active = false;
            this.titel2.active = true;
            lightBg0.active = false;
            lightBg1.active = false;
            lightBg1.stopAllActions();
        }
        //window.gameApplication.scaleUpAndDowm(this.giftBtn, true, this.giftBtnLight);
    },

    // update (dt) {},
});
