class Sounds{
    constructor(){
        this.muted = false;
    }

    init(){
        this.soundsSource = ["sounds/shot.mp3", "sounds/ufoDeath.mp3", "sounds/explosion.mp3"];
        this.allSounds = [];
        for (let i = 0; i < this.soundsSource.length; i++){
            const audio = new Audio();
            audio.src = this.soundsSource[i];
            audio.setAttribute("preload", "auto");
            this.allSounds.push(audio);
        }
    }

    playSound(soundName){
        if (this.muted){
            return;
        }
        let soundNumber;
        switch (soundName){
            case "shot":
                soundNumber = 0;
                break;
            case "ufoDeath":
                soundNumber = 1;
                break;
            case "explosion":
                soundNumber = 2;
                break;
            default:
                return;
                
        }
        this.allSounds[soundNumber].currentTime = 0;
        this.allSounds[soundNumber].play();
    }

    muteSwitch(){
        this.muted = !this.muted;
    }
}