export class Audio {

    static getInstance() {
        if (!Audio.instance) {
            Audio.instance = new Audio();
        }
        return Audio.instance;
    }

    constructor() {
        this.audio = wx.createInnerAudioContext();
    }
    static merge(){
        let audio = Audio.getInstance();
        audio.audio.src = 'res/merge.mp3';
        audio.audio.play();
    }

    static move(){
        let audio = Audio.getInstance();
        audio.audio.src = 'res/move.mp3';
        audio.audio.play();
    }

    static stop(){
        let audio = Audio.getInstance();
        audio.audio.stop();
    }
}