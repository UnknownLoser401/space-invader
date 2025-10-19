class GameOverPosition{
    constructor(){
        
    }

    draw(play){
        ctx.clearRect(0, 0, play.width, play.height);

        ctx.font = "80px Comic Sans MS";
        ctx.textAlign = "center";

        ctx.fillStyle = "#ffffff"
        ctx.fillText("Game Over", play.width / 2, play.height / 2 - 140);

        ctx.font = "80px Comic Sans MS";
        ctx.fillStyle = "#D7DF01";
        ctx.fillText("You have reached level" + play.level, play.width / 2, play.height / 2);
        
    }
}