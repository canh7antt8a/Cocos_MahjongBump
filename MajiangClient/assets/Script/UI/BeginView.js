cc.Class({
    extends: cc.Component,

    properties: {
        gameApplication: {
            default: null,
            type: Object
        },
        musicSprite: {
            default: null,
            type: cc.Node,
        },
        shine:{
            default: [],
            type: [cc.Node],
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

    onEnable() {
        this.LoadRank();
        window.timeGiftScript.giftBtn.y = (cc.winSize.height * 0.5) - 80;
        window.timeGiftScript.giftBtn.x = (cc.winSize.width * 0.5) - 100;
        window.timeGiftScript.giftBtn.active = false;
        gameApplication.popGameView.active = true;
    },

    onDisable(){
        gameApplication.popGameView.active = false;
    },

    onLoad: function () {
        if (window.gameApplication.soundManager.isOpen) {
            this.musicSprite.active = false;
        } else {
            this.musicSprite.active = true;
        }

        for (var i = 0; i < 3; i = i + 1) {
            this.shineAnim(i);
        }
    },

    shineAnim(i){
        this.scheduleOnce(function(){
            this.shine[i].active = true;
        }.bind(this),1.1 + i*0.3)
    },

    start() {
        this.LoadRank();
    },

    onBtnClicked(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        if ("Play" == type) {
            window.gameApplication.openMainView(true);
        } else if ("Music" == type) {
            if (window.gameApplication.soundManager.isOpen) {
                window.gameApplication.soundManager.setIsOpen(false);
                this.musicSprite.active = true;
            } else {
                window.gameApplication.soundManager.setIsOpen(true);
                this.musicSprite.active = false;
            }
        }
        else if ("Sign" == type) {
            window.gameApplication.openMissionView(true);
        } else if ("Gift" == type) {
            window.gameApplication.onGiftBtnClick(function (isCompleted) {
                //奖励
                var self = this;
                if (isCompleted) {
                    window.gameApplication.soundManager.playSound("tip");
                    SDK().getItem("tips", function (tip) {
                        tip = tip + 1;
                        SDK().setItem({ tips: tip }, null);
                        window.gameApplication.flyTipAnim();
                    }.bind(this));
                }
            }.bind(this));
        } else if ("Share" == type) {
            SDK().getItem("all", function (val) {
                window.gameApplication.onShareBtnClick(val);
            }.bind(this));
        }
        //榜单界面
        else if ("WorldRank" == type) {
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
    },

    update(dt) {

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
        var isOnRank = false;
        for (var i = 0; i < this.worldPlayer.length; i = i + 1) {
            if (this.LoadRankData(i, this.worldPlayer[i])) {
                isOnRank = true;
            }
        }
        //如果自己不在榜单上就将自己加载最后
        var listLength = this.worldPlayer.length;
        if (!isOnRank) {
            listLength = listLength + 1;
            SDK().getRankScore(2, function (info) {
                if (info != null) {
                    this.LoadRankData(listLength - 1, info);
                }
            }.bind(this))
        }
        //隐藏多余的榜单
        if (listLength < this.worldUIPlayer.length) {
            for (var i = this.worldPlayer.length; i < this.worldUIPlayer.length; i = i + 1) {
                this.worldUIPlayer[i].playerBar.active = false;
            }
        }
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
        if (playerData.id == SDK().getSelfInfo().id) {
            //mainBg.spriteFrame = this.rankAtlas.getSpriteFrame("bg1");
            isOnRank = true;
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
        return isOnRank;
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
