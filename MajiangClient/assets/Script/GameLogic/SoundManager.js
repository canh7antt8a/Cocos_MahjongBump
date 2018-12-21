cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        btn_click: {
            url: cc.AudioClip,
            default: null
        },
        reward:{
            url: cc.AudioClip,
            default: null
        },
        gamewin: {
            url: cc.AudioClip,
            default: null
        },
        failGame:{
            url: cc.AudioClip,
            default: null
        },
        m1: {
            url: cc.AudioClip,
            default: null
        },
        m2: {
            url: cc.AudioClip,
            default: null
        },
        m3: {
            url: cc.AudioClip,
            default: null
        },
        boom:{
            url: cc.AudioClip,
            default: null
        },
        parBoom:{
            url: cc.AudioClip,
            default: null
        },
        getKey: {
            url: cc.AudioClip,
            default: null
        },
        tip: {
            url: cc.AudioClip,
            default: null
        },
        blockDown: {
            url: cc.AudioClip,
            default: null
        },
        isOpen: true,
        isBgOpen: true,
        isVoiceOpen: true,
    },

    // LIFE-CYCLE CALLBACKS: 

    playSound: function (soundtype) {
        if (this.isOpen) {
            switch (soundtype) {
                case "btn_click":
                    cc.audioEngine.play(this.btn_click, false, 1);
                    break;
                case "reward":
                    cc.audioEngine.play(this.reward, false, 1);
                    break;
                case "winGame":
                    cc.audioEngine.play(this.gamewin, false, 1);
                    break;
                case "failGame":
                    cc.audioEngine.play(this.failGame, false, 1);
                    break;
                case "getKey":
                    cc.audioEngine.play(this.getKey, false, 1);
                    break;
                case "parBoom":
                    cc.audioEngine.play(this.parBoom, false, 1);
                    break;
                case "boom":
                    cc.audioEngine.play(this.boom, false, 1.5);
                    break;
                case "1":
                    cc.audioEngine.play(this.m1, false, 1);
                    break;
                case "2":
                    cc.audioEngine.play(this.m2, false, 1);
                    break;
                case "3":
                    cc.audioEngine.play(this.m3, false, 1);
                    break;
                case "tip":
                    cc.audioEngine.play(this.tip, false, 0.3);
                    break;
                case "blockDown":
                    cc.audioEngine.play(this.blockDown, false, 0.3);
                    break;
            }
        }
    },

    playBg: function () {
        if (this.isBgOpen) {
            this.audioSource.play();
        }else{
            this.audioSource.stop();
        }
    },

    setVoiceIsOpen: function (isOpen) {
        this.isVoiceOpen = isOpen;
        if (isOpen) {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(0)
                }
            } catch (e) {

            }
        } else {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(1)
                }
            } catch (e) {

            }
        }

    },

    setBgOpen: function (isOpen) {
        this.isBgOpen = isOpen;
        if (this.isBgOpen) {
            try {
                if (str != null) {
                    HiboGameJs.mute(0)
                }
            } catch (e) {

            }

        } else {
            try {
                if (str != null) {
                    HiboGameJs.mute(1)
                }
            } catch (e) {

            }
        }
        this.playBg();
    },

    setIsOpen: function (isOpen) {
        this.isOpen = isOpen;
        if (this.isOpen) {
            try {
                if (str != null) {
                    HiboGameJs.mute(0)
                }
            } catch (e) {

            }

        } else {
            try {
                if (str != null) {
                    HiboGameJs.mute(1)
                }
            } catch (e) {
            }
        }
    },
});
