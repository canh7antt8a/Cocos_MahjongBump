cc.Class({
    extends: cc.Component,

    properties: {
        AdsView: {
            default: null,
            type: cc.Node,
        },
        noAdsView: {
            default: null,
            type: cc.Node,
        },
        starts: {
            default: null,
            type: cc.Node,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        missionItem: {
            default: null,
            type: cc.Node,
        },
        missions: {
            default: null,
            visible:false,
        },
        gameApplication: {
            default: null,
            type: Object,
            visible:false,
        },
        watchADTip: {
            default: null,
            type: cc.Node,
            visible:false,
        },
        unlock_bid: {
            default: 0,
            type: cc.Integer,
            visible:false,
        },
        unlock_mid: {
            default: 0,
            type: cc.Integer,
            visible:false,
        },
        unlock_ad: {
            default: 0,
            type: cc.Integer,
            visible:false,
        },
        watched_ad: {
            default: 0,
            type: cc.Integer,
            visible:false,
        },
        missionNodes: {
            default: {},
            visible:false,
        }
    },
    onLoad: function () {
        this.missions = null;
        this.gameApplication = cc.find("GameApplication").getComponent("GameApplication");
        this.init();
        /* cc.director.preloadScene("game", function () {
        }); */
    },

    onEnable(){
        SDK().getItem("all", function (score) {
            this.starts.getComponent(cc.Label).string = score.toString();
        }.bind(this));
        window.dailyScript.checkCurDay();
        this.content.active = true;
        window.timeGiftScript.giftBtn.active = false;
        window.misstionScript.reFresh();
    },

    showNoAds() {
        this.noAdsView.active = true;
    },

    hideNoAds() {
        this.noAdsView.active = false;
    },

    init() {
        if (this.missions == null || Object.keys(this.missions).length <= 0) {
            this.gameApplication.getMissions(function (results) {
                this.missions = results;
                this.initContents();
            }.bind(this));
        } else {
            this.initContents();
        }

        var self = this;
        SDK().getItem("all", function (score) {
            self.starts.getComponent(cc.Label).string = score.toString();
        }.bind(this));

    },

    initContents() {
        this.hideAllItem();
        var idx = 0;
        this.missions.forEach(function (mission) {
            this.initMissionItem(mission, idx);
            idx++;
        }.bind(this));
    },

    initMissionItem(mission, idx) {
        let i = idx;
        var cannonNode = cc.instantiate(this.missionItem);
        cannonNode.parent = this.content;
        cannonNode.active = true;
        cannonNode.tag = idx;
        cannonNode.getChildByName("title").getComponent(cc.Label).string = "Level"; /* mission["title_" + this.gameApplication.curLang] */ 

        //var bgPath = (idx % 5) + 1;
        //var starObj = cannonNode.getChildByName("star");
        //var lockObj = cannonNode.getChildByName("lock");
        //cannonNode.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.ui_viewAtlas.getSpriteFrame("mission" + bgPath + "Bg");

        var stars = mission['stars'];
        var bid = mission['bid'];
        var mid = mission['mid'];
        var unlock_ad = mission['unlock_ad'];
        var unlock_star = mission['unlock_star'];

        this.missionNodes[bid + "_" + mid] = cannonNode;

        SDK().getItem(bid + "_" + mid, function (score) {
            cc.find("unlock/count", cannonNode).getComponent(cc.Label).string =(1+(mid-1)*100)+" - "+mid*100 //score + "/" + stars ;
            cc.find("lock/count", cannonNode).getComponent(cc.Label).string = (1+(mid-1)*100)+" - "+mid*100//score + "/" + stars ;
        })

        this.isUnlock(i,function(isUnlock){
            isUnlock = true;
            cc.find("unlock",cannonNode).active = isUnlock;
            cc.find("lock",cannonNode).active = !isUnlock;
        });

        /* if (unlock_ad <= 0) {
            cc.find("unlock", cannonNode).active = true;
            cc.find("lock", cannonNode).active = false;
        } else {
            SDK().getItem("all", function (score) {
                if (score > unlock_star) {
                    cc.find("unlock", cannonNode).active = true;
                    cc.find("lock", cannonNode).active = false;
                } else {
                    SDK().getItem("unlock_" + bid + "_" + mid, function (adTime) {
                        if (adTime >= unlock_ad) {
                            cc.find("unlock", cannonNode).active = true;
                            cc.find("lock", cannonNode).active = false;
                        } else {
                            cc.find("unlock", cannonNode).active = false;
                            cc.find("lock", cannonNode).active = true;
                        }
                    }.bind(this));
                }
            }.bind(this));

        } */

    },

    showAdsView(){
        this.AdsView.active = true;
        var Bg = this.AdsView.getChildByName("Bg");
        var Titel = Bg.getChildByName("Titel").getComponent(cc.RichText);
        Titel.string = "<b><color=#9C9999>Need "+this.unlock_star+" stars,\nUnlock now by watching the AD?</c></b>"
        var ADbtn = this.AdsView.getChildByName("AD");
        ADbtn.off(cc.Node.EventType.TOUCH_END);
        ADbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onWatchVideoBtnClicked();
        }, this);
        var Later = this.AdsView.getChildByName("Later");
        Later.off(cc.Node.EventType.TOUCH_END);
        Later.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.AdsView.active = false;
        }, this);
    },

    onWatchVideoBtnClicked() {
        var self = this;
        window.gameApplication.onVideoBtnClick(function (isCompleted) {
            if (isCompleted) {
                this.AdsView.active = false;
                //进入关卡
                var bid = self.unlock_bid;
                var mid = self.unlock_mid;
                var unlock_ad = self.unlock_ad;
                self.watched_ad++;
                //更新node
                var cannonNode = this.missionNodes[bid + "_" + mid];
                if (self.watched_ad >= unlock_ad) {
                    self.showLevelPanel(bid, mid);
                    cc.find("unlock", cannonNode).active = true;
                    cc.find("lock", cannonNode).active = false;
                } else {
                    cc.find("unlock", cannonNode).active = false;
                    cc.find("lock", cannonNode).active = true;
                }
                //记录这一关看广告次数
                var param = {};
                param["unlock_" + bid + "_" + mid] = self.watched_ad;
                SDK().setItem(param, null);
            }
        }.bind(this));
    },

    onMissionItemClicked(event) {
        var self = this;
        if(self.content.active){
            self.content.active = false;
        }
        var target = event.target;
        var targetBtn = target.getComponent(cc.Button);

        // target.getComponent(cc.Button).interactable = false;
        var tag = parseInt(target.tag);
        var mission = this.missions[tag];
        if (mission == null) {
            return;
        }

        var bid = mission['bid'];
        var mid = mission['mid'];
        var unlock_ad = mission['unlock_ad'];

        this.isUnlock(tag,function(isUnlock){
            isUnlock = true;
            if(isUnlock){
                //不需要解鎖，直接進遊戲
                self.showLevelPanel(bid,mid);
            }else{
                self.content.active = true;
                SDK().getItem("unlock_"+bid+"_"+mid,function(watched_ad){
                    self.unlock_bid = bid;
                    self.unlock_mid = mid;
                    self.unlock_ad = unlock_ad;
                    self.unlock_star = mission['unlock_star']
                    self.watched_ad = watched_ad;
                    self.showAdsView();
                })
            }
        });

        /* if (unlock_ad <= 0) {
            this.showLevelPanel(bid, mid);
            targetBtn.interactable = true;
        } else {
            var isUnlock = false;
            SDK().getItem("unlock_" + bid + "_" + mid, function (test) {
                if (test >= unlock_ad) {
                    isUnlock = true;
                }
                if (isUnlock) {
                    self.showLevelPanel(bid, mid);
                    targetBtn.interactable = true;
                } else {
                    self.unlock_bid = bid;
                    self.unlock_mid = mid;
                    self.unlock_ad = unlock_ad;
                    self.unlock_star = mission['unlock_star']
                    self.watched_ad = test;
                    self.showAdsView();
                    targetBtn.interactable = true;
                }
            }.bind(this));
        } */
    },

    isUnlock(idx,cb){
        let mission = this.missions[idx];
        let bid = mission['bid'];
        let mid = mission['mid'];
        let unlock_ad = mission['unlock_ad'];
        let unlock_star = mission['unlock_star'];

        if(unlock_star <= 0){
            cb(true)
            return;
        }
        //先检查星星是否足够
        SDK().getItem("all",function(score){
            if(score >= unlock_star){
                cb(true)
                return;
            }else{
                SDK().getItem("unlock_"+bid+"_"+mid,function(test){
                    if(test >= unlock_ad){
                        cb(true)
                        return;
                    }else{
                        cb(false);
                    }
                });
            }
        });
    },

    hideAllItem() {
        if (this.content.childrenCount > 0) {
            this.content.children.forEach(function (n) {
                n.active = false;
                n.destroy();
            });
        }
    },

    showLevelPanel(bid, mid) {
        window.gameApplication.openLevelView(bid, mid, this.missions[mid - 1],true);
        window.gameApplication.soundManager.playSound("btn_click");
    },

    onBackBtnClicked() {
        window.gameApplication.openBeginView(true);
        window.gameApplication.soundManager.playSound("btn_click");
    },


    // update (dt) {},
});
