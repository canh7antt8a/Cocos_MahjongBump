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
        giftBtn: {
            default: null,
            type: cc.Node,
        },
        giftMask: {
            default: null,
            type: cc.Node,
        },
        giftView: {
            default: null,
            type: cc.Node,
        },
        giftTip: {
            default: null,
            type: cc.Node,
        },
        giftTimeText: {
            default: null,
            type: cc.Label,
        },
        giftTime: {
            default: 0,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.timeGiftScript = this;
        this.node.setLocalZOrder(100);
        
        SDK().getItem("giftTime", function (time) {
            this.giftTime = time;
        }.bind(this));
    },

    openBtn() {
        window.gameApplication.soundManager.playSound("btn_click");
        if (this.giftTip.active) {
            this.showTimeGiftView();
        }
    },

    start() {
        this.checkTime(true);
    },

    showTimeGiftView() {
        this.giftView.active = true;
        var bg = this.giftView.getChildByName("Bg");
        var open = bg.getChildByName("OpenView");
        open.scale = 0;
        open.runAction(
            cc.spawn(cc.fadeIn(0.5),
                cc.scaleTo(1.2, 1).easing(cc.easeBackInOut())
            ));
        var receive = bg.getChildByName("ReceiveView");
        open.active = true;
        receive.active = false;
        var lightBg = receive.getChildByName("LightBg");
        var receiveBtn = receive.getChildByName("Receive");
        var doubleBtn = receive.getChildByName("Double");
        var openBtn = open.getChildByName("Open");

        //打开礼物按钮
        openBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            this.giftTime = timestamp;
            SDK().setItem({ giftTime: this.giftTime }, null);
            SDK().getItem("tips", function (tip) {
                tip = tip + 2;
                SDK().setItem({ tips: tip }, null);
                if (null != window.tipText) {
                    window.tipText.string = tip;
                }
            }.bind(this));
            lightBg.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
            receive.active = true;
            receive.opacity = 0;
            receive.scale = 0;
            window.gameApplication.soundManager.playSound("parBoom");
            open.runAction(cc.spawn(
                cc.fadeIn(0.5),
                cc.scaleTo(0.5, 0).easing(cc.easeBackInOut())
            ))
            receive.runAction(
                cc.spawn(cc.fadeIn(0.5),
                    cc.scaleTo(1.2, 1).easing(cc.easeBackInOut())
                ));
        }, this);

        //接收按钮
        receiveBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            this.giftView.active = false;
            window.gameApplication.soundManager.playSound("tip");
            for (var i = 0; i < 2; i = i + 1) {
                this.scheduleOnce(function () {
                    window.gameApplication.flyTipAnim();
                }.bind(this), i * 0.2)
            }
        }, this);

        //双倍按钮
        doubleBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            window.gameApplication.onVideoBtnClick(function (isCompleted) {
                if (isCompleted) {
                    SDK().getItem("tips", function (tip) {
                        tip = tip + 2;
                        SDK().setItem({ tips: tip }, null);
                        if (null != window.tipText) {
                            window.tipText.string = tip;
                        }
                    }.bind(this));
                    this.giftView.active = false;
                    window.gameApplication.soundManager.playSound("tip");
                    for (var i = 0; i < 4; i = i + 1) {
                        this.scheduleOnce(function () {
                            window.gameApplication.flyTipAnim();
                        }.bind(this), i * 0.2)
                    }
                }
            }.bind(this));
        }, this);
    },

    checkTime(isStart) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (timestamp - this.giftTime > 3600) {
            if ((!this.giftTip.active && this.giftMask.active) || isStart) {
                this.giftTip.active = true;
                this.giftMask.active = false;
                this.giftTimeText.node.active = false;
                //window.gameApplication.scaleUpAndDowm(this.giftBtn,true,this.giftTip);
            }
        } else {
            if ((this.giftTip.active && !this.giftMask.active) || isStart) {
                this.giftTip.active = false;
                this.giftTip.stopAllActions();
                this.giftMask.active = true;
                this.giftTimeText.node.active = true;
                this.giftBtn.stopAllActions();
                this.giftBtn.scale = 1;
            }
            var temp = timestamp - this.giftTime;
            temp = 3600 - temp;
            var min = temp / 60 < 10 ? "0" + Math.floor(temp / 60) : "" + Math.floor(temp / 60);
            var sec = temp % 60 < 10 ? "0" + Math.floor(temp % 60) : "" + Math.floor(temp % 60);
            if (temp <= 0) {
                min = "00";
                sec = "00"
            }
            this.giftTimeText.string = min + "/" + sec;
        }
    },

    update(dt) {
        this.checkTime(false);
    },
});
