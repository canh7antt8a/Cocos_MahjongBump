
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: {
            default: null,
            type: cc.ScrollView,
        },
        title: {
            default: null,
            type: cc.Label,
        },
        starts: {
            default: null,
            type: cc.Label,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        itemList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },
        levels: {
            default: {},
            visible: false,
        },
        curMaxIdx: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        bid: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        mid: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        gameApplication: {
            default: null,
            type: Object,
            visible: false,
        },
        /* ui_viewAtlas:{
            default:null,
            type:cc.SpriteAtlas,
        }, */
        lastLid: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        levelItem: {
            default: null,
            type: cc.Node,
        },
    },

    onEnable() {
        SDK().getItem("all", function (score) {
            this.starts.getComponent(cc.Label).string = score.toString();
        }.bind(this));
        this.content.active = true;
        window.timeGiftScript.giftBtn.active = false;
        window.misstionScript.reFresh();
    },

    onLoad: function () {
        this.gameApplication = cc.find("GameApplication").getComponent("GameApplication");

        this.scrollView.node.on("scroll-to-bottom", this.scorllToBottom, this);

    },

    scorllToBottom(event) {
        if (this.curMaxIdx < total_level) {
            this.initPart(this.curMaxIdx + 1);
        }
    },

    start() {

    },

    init(bid, mid, mission) {
        this.hideAllItem();
        this.title.string = "";
        if ((this.levels == null || Object.keys(this.levels).length <= 0) || this.bid != bid || this.mid != mid) {
            this.bid = bid;
            this.mid = mid;
            this.levels = mission;
            this.initContents();
        } else {
            this.bid = bid;
            this.mid = mid;
            this.initContents();
        }

        var self = this;
        var tmp_path = "conf/level_detail/" + bid + "/" + mid + "/" + 1;
        window.gameApplication.getConf(tmp_path, null);
        SDK().getItem("all", function (score) {
            self.starts.getComponent(cc.Label).string = score.toString();
            /* //预加载上下两关
            var tmpId = score + 1;
            var arr = [];
            arr.push(tmpId);

            if (tmpId > 1) {
                arr.push(tmpId - 1);
            }
            arr.forEach(function (tmp_lid) {
                var tmp_path = "conf/level_detail/b_" + bid + "/" + mid + "/" + tmp_lid;
                // cc.log("------tmp_path:",tmp_path);
                self.gameApplication.getConf(tmp_path, null);
            });
 */
        }.bind(this));
    },

    initContents() {
        var self = this;
        this.title.string = (1 + (self.levels.mid - 1) * 100) + " - " + self.levels.mid * 100;
        this.lastLid = 0;

        this.bid = self.levels.bid;
        this.mid = self.levels.mid;
        self.initLevels(self.levels);
    },

    initLevels(level) {
        this.scrollView.scrollToTop();
        window.total_level = level['stars'];
        this.initPart(1);
        var tmp_path = "conf/level_detail/" + this.bid + "/" + this.mid + "/" + window.lastLid;
        window.gameApplication.getConf(tmp_path, null);
        this.content.active = true;
    },

    initPart(num) {
        for (var i = num; i <= num + 19 || i <= total_level; i = i + 1) {
            if (i > num + 19) {
                if(this.itemList[i - 1] != null){
                    var itemNode = this.itemList[i - 1];
                    var i_str = i.toString();
                    var lid = i;
                    itemNode.tag = lid;
                    //重置
                    this.setItem(itemNode, 0, false, lid);
                    this.checkUnLock(itemNode, lid);
                }
            } else {
                if (null == this.itemList[i - 1]) {
                    var cannonNode = cc.instantiate(this.levelItem);
                    cannonNode.parent = this.content;
                    cannonNode.active = true;
                    cannonNode.tag = i;
                    this.itemList[i - 1] = cannonNode;
                }
                var i_str = i.toString();

                var itemNode = this.itemList[i - 1];
                if (i > total_level) {
                    itemNode.active = false;
                } else {
                    var lid = i;
                    itemNode.tag = lid;
                    //重置
                    this.setItem(itemNode, 0, false, lid);
                    this.checkUnLock(itemNode, lid);
                }
            }

        }
        this.curMaxIdx = num + 19;
    },

    //判断是否解锁
    checkUnLock(itemNode, lid) {
        var self = this;
        SDK().getItem(self.bid + "_" + self.mid + "_" + lid + "_score", function (score) {
            self.setItem(itemNode, score, true, lid);
            /* var isOpen = false;
            if (lid <= self.lastLid + 1 || score > 0 || lid == 1) {
                isOpen = true;
                self.setItem(itemNode, score, isOpen, lid);
            } else if (openAllLevel) {
                self.setItem(itemNode, score, true, lid);
            } */
            if (score > 0) {
                self.lastLid = lid;
                window.lastLid = lid;
            }
        });
    },

    setItem(node, score, isOpen, lid) {
        var self = this;
        var unlockBg = cc.find("unlock", node);
        unlockBg.active = isOpen;
        //unlockBg.getComponent(cc.Sprite).spriteFrame = this.ui_viewAtlas.getSpriteFrame("check"+ (((this.mid-1)%5 + 1)) +"Bg");
        unlockBg.width = 200;
        unlockBg.height = 50;
        var lockBg = cc.find("lock", node);
        lockBg.active = !isOpen;
        lockBg.width = 200;
        lockBg.height = 50;
        cc.find("unlock/text", node).getComponent(cc.Label).string = (self.levels.mid - 1) * 100 + lid;
        cc.find("unlock/star", node).active = true;
        if (score <= 0) {
            cc.find("unlock/star", node).width = 0;
        } else {
            cc.find("unlock/star", node).width = score * 48;
        }
        SDK().getItem(self.bid + "_" + self.mid + "_" + lid + "_time", function (time) {
            var timelabel = cc.find("unlock/time/label", node);
            var min = Math.floor(time / 100);
            var second = Math.floor(time % 100)
            if (time != 0 && time != null) {
                timelabel.getComponent(cc.Label).string = min + ":" + (second >= 10 ? second : "0" + second);
            } else {
                timelabel.getComponent(cc.Label).string = "--:--"
            }

        }.bind(this))
        //cc.find("lock/text", node).getComponent(cc.Label).string = lid;
        node.active = true;
    },

    onLevelItemClicked(event) {
        if (this.content.active) {
            this.content.active = false;
        }
        this.gameApplication.soundManager.playSound("btn_click");
        var target = event.target;
        var targetBtn = target.getComponent(cc.Button);

        var tag = parseInt(target.tag);
        //判断是否可以玩
        if (tag < 1 || tag > this.lastLid + 1 && false) {
            //不能玩
            this.content.active = true;
        } else {
            if (window.isGoPlay) {
                return;
            }
            window.isGoPlay = true;
            //cc.log(this.bid,this.mid,tag);
            window.bid = this.bid;
            window.mid = this.mid;
            window.lid = tag;
            window.isChallenge = false;
            window.gameApplication.openGameView(true);
        }
    },

    hideAllItem() {
        this.content.active = false;
    },

    onBackBtnClicked() {
        this.hideAllItem();
        this.gameApplication.openMainView(true);
        this.gameApplication.soundManager.playSound("btn_click");
    },
    // update (dt) {},
});
