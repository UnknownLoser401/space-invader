class InGamePosition{
    constructor(setting, level){
        
    }
    draw(play){
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = "40px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff3322";
        ctx.fillText("abcde", play.width / 2, play.height / 2);
    }
}