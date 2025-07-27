class OpeningPosition{
    constructor(){

    }

    draw(play){
        ctx.clearRect(0, 0, play.width, play.height);

        ctx.font = "80px Comic Sans MS";
        ctx.textAlign = "center";
        const gradient = ctx.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
        gradient.addColorStop("0", "yellow");
        gradient.addColorStop("0.5", "red");
        gradient.addColorStop("1.0", "yellow");
        ctx.fillStyle = gradient;
        ctx.fillText("UFO Hunter", play.width / 2, play.height / 2 - 140);

        ctx.font = "80px Comic Sans MS";
        ctx.fillStyle = "#D7DF01";
        ctx.fillText("Press 'SPACE' to start.", play.width / 2, play.height / 2);

        ctx.font = "40px Comic Sans MS";
        ctx.fillStyle = "#2e2f00";
        ctx.fillText("Game Control", play.width / 2, play.height / 2 + 210);
        ctx.fillText("Left Arrow: Move Left", play.width / 2, play.height / 2 + 250);
        ctx.fillText("Right Arrow: Move Right", play.width / 2, play.height / 2 + 290);
        ctx.fillText("Space: Fire", play.width / 2, play.height / 2 + 330);
    }

    keyDown(play, keyboardCode){
        if (keyboardCode == "Space"){
            play.level = 1;
            play.score = 0;
            play.shields = 2;
            play.goToPosition(new TransferPosition(play.level));
        }
    }
}