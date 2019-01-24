export class Audio {

    static getInstance() {
        if (!Audio.instance) {
            Audio.instance = new Audio();
        }
        return Audio.instance;
    }

    constructor() {
        this.audio = wx.createInnerAudioContext();
        this.audio.volume = 0.2;
    }

    merge(){
        this.audio.src='res/merge.mp3';
        this.audio.play();
    }

    move(){
        this.audio.src = 'res/move.mp3';
        this.audio.play();
    }

    stop(){
        this.audio.stop();
    }

    destroy(){
        this.audio.destroy();
    }
}