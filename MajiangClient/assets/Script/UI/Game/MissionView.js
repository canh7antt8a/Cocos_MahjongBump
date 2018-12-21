// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var missionCount = [1,2, 5, 10, 15, 30, 50, 5];
var missionName = ["job1","job1", "job2", "job2", "job2", "job2", "job2", "job3"];
cc.Class({
    extends: cc.Component,

    properties: {
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
        missionVal: {
            default: [],
            type: [cc.Float],
            visible: false,
        },
        progress: {
            default: [],
            type: [cc.ProgressBar],
        },
        btns: {
            default: [],
            type: [cc.Button],
        },
        tipList: {
            default: [],
            type: [cc.Node],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.node.setLocalZOrder(1500);
        for (var i = 0; i < this.btns.length; i = i + 1) {
            this.btns[i].interactable = false;
        }
        this.checkReFresh();
        this.reFresh();
        //如果在游戏中
        if (window.isPlaying) {
            window.isPlaying = false;
            window.isPoP = true;
        }
    },

    onDisable() {
        //如果在游戏中
        if (window.isPoP) {
            window.isPoP = false;
            window.isPlaying = true;
        }
    },

    onLoad() {
        window.misstionScript = this;
    },

    //检查是否需要刷新任务
    checkReFresh() {
        var myDate = new Date();
        let month = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        let day = myDate.getDate();        //获取当前日(1-31)
        this.curMonth = month;
        this.curDay = day;
        SDK().getItem("month", function (m) {
            if (m == null || m == 0) {
                SDK().setItem({ month: month });
                SDK().setItem({ day: day });
                this.reSet();
            } else {
                if (m != month) {
                    SDK().setItem({ month: month });
                    SDK().setItem({ day: day });
                    this.reSet();
                } else {
                    SDK().getItem("day", function (d) {
                        if (d != day) {
                            SDK().setItem({ day: day });
                            this.reSet();
                        }
                    }.bind(this))
                }
            }
        }.bind(this))
    },

    //重置任务
    reSet() {
        //需要完成的人物数量全部置零
        SDK().setItem({ job1: 0 });
        SDK().setItem({ job2: 0 });
        SDK().setItem({ job3: 0 });
        //按钮全部变成不可按，进度条清空
        for (var i = 0; i < this.btns.length; i = i + 1) {
            this.btns[i].node.parent.active = true;
            this.btns[i].interactable = false;
            this.progress[i].progress = 0;
            //将完成状态全部置位0
            var param = {};
            param["mission" + i] = 0;
            SDK().setItem(param);
        }
    },

    //刷新任务进度
    reFresh() {
        for (var i = 0; i < this.tipList.length; i = i + 1) {
            this.tipList[i].active = false;
        }
        for (var i = 0; i < this.btns.length; i = i + 1) {
            this.checkMission(i, false);
        }
    },

    //任务进度检查
    checkMission(i, isAdd) {
        let val = 0;
        let name = missionName[i];//任务名
        //获取任务对应任务名的完成数量
        SDK().getItem(name, function (job) {
            //判断数量是否达标
            if (job >= missionCount[i]) {
                val = 1;
                var pros = this.progress[i].node.getChildByName("String").getComponent(cc.Label);
                pros.string = missionCount[i] + "/" + missionCount[i];
            } else {
                //是否自增
                if (isAdd) {
                    job = job + 1;
                    var param = {};
                    param["" + name] = job;
                    SDK().setItem(param);
                }
                //设置数量String
                val = job / missionCount[i];
                var pros = this.progress[i].node.getChildByName("String").getComponent(cc.Label);
                pros.string = job + "/" + missionCount[i];
            }
            //设置进度条长度
            this.missionVal[i] = val;
            this.progress[i].progress = this.missionVal[i];

            //按钮是否显示
            if (this.missionVal[i] >= 1) {
                //判断是否完成过
                this.setBtnStatus(i);
            } else {
                this.btns[i].interactable = false;
            }
        }.bind(this));
    },

    setBtnStatus(idx) {
        let i = idx;
        SDK().getItem(("mission" + i), function (isFinish) {
            if (isFinish == 1) {
                this.btns[i].node.parent.active = false;
                this.btns[i].interactable = false;
            } else {
                this.btns[i].node.parent.active = true;
                this.btns[i].interactable = true;
                for (var j = 0; j < this.tipList.length; j = j + 1) {
                    this.tipList[j].active = true;
                }
            }
        }.bind(this));
    },

    //按钮点击事件
    btnClick(event, val) {
        var curBtn = event.target.getComponent(cc.Button);
        curBtn.interactable = false;
        for (var i = 0; i < missionCount.length; i = i + 1) {
            //点击之后将任务置位完成状态
            if (curBtn == this.btns[i]) {
                var param = {};
                param["mission" + i] = 1;
                SDK().setItem(param);
            }
        }
        SDK().getItem("tips", function (tip) {
            tip = tip + parseInt(val);
            SDK().setItem({ tips: tip });
        }.bind(this));
        window.gameApplication.soundManager.playSound("tip");
        for (var i = 0; i < val && i <= 10; i = i + 1) {
            this.scheduleOnce(function () {
                window.gameApplication.flyTipAnim();
            }.bind(this), i * 0.2)
        }
        this.reFresh();
    },

    closeView(){
        window.gameApplication.soundManager.playSound("btn_click");
        window.gameApplication.openMissionView(false);
    },

    update(dt) {
    },
});
