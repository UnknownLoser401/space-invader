class InGamePosition{
    constructor(setting, level){
        this.setting = setting;
        this.level = level;
        this.object = null;
        this.spaceship = null;
        this.bullets = [];
        this.ufos = [];
        this.lastBulletTime = null;
        this.lastShootTime = null;
        this.lastWeaponTime = null;
        this.bombs = [];
        this.skill_items = [];
        this.skill_weapons = [];
    }

    entry(play){
        this.direction = 1;
        this.horizontalMoving = 1;
        this.verticalMoving = 0;
        this.ufosAreSinking = false;
        this.ufoPresentSinkingValue = 0;
        this.spaceship_image = new Image();
        this.ufo_image = new Image();
        this.upSec = this.setting.updateSeconds;
        this.spaceshipSpeed = this.setting.spaceshipSpeed;

        const rows = this.setting.ufoRows;
        const columns = this.setting.ufoColumns;
        const ufosInitial = [];
        const presentLevel = this.level;

        for (let row = 0; row < rows; row++){
            for (let column = 0; column < columns; column++){
                this.object = new Objects();
                let x = (play.width / 2) - ((columns - 1) * 25) + (column * 50);
                let y = (play.playBoundaries.top + 30) + (row * 30);
                ufosInitial.push(this.object.ufo(x, y, row, column, this.ufo_image));
            }
        }

        this.ufos = ufosInitial;

        
        this.ufoSpeed = this.setting.ufoSpeed + (presentLevel * 7)
        this.bombSpeed = this.setting.bombSpeed + (presentLevel * 10);
        this.bombFrequency = this.setting.bombFrequency + (presentLevel * 0.05);

        this.object = new Objects();
        this.spaceship = this.object.spaceship((play.width / 2), play.playBoundaries.bottom, this.spaceship_image);
    }

    draw(play){
        ctx.clearRect(0, 0, play.width, play.height);
        // ctx.font = "40px Comic Sans MS";
        // ctx.textAlign = "center";
        // ctx.fillStyle = "#ff3322";
        // ctx.fillText("abcde", play.width / 2, play.height / 2);
        ctx.drawImage(this.spaceship_image, this.spaceship.x - (this.spaceship.width / 2), this.spaceship.y - (this.spaceship.height / 2));
        ctx.fillStyle = "#ff0000";
        for (let i = 0; i < this.bullets.length; i++){
            let bullet = this.bullets[i];
            ctx.fillRect(bullet.x - 1, bullet.y - 6, 2, 6);
        }

        for (let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            ctx.drawImage(this.ufo_image, ufo.x - (ufo.width / 2), ufo.y - (ufo.height / 2));

        }
        ctx.fillStyle = "#FE2EF7";
        for (let i = 0; i < this.bombs.length; i++){
            let bomb = this.bombs[i];
            ctx.fillRect(bomb.x - 2, bomb.y - 6, 4, 6);
        }

        ctx.fillStyle = "#F0B623";
        ctx.globalCompositeOperation = 'destination-over';
        for (let i = 0; i < this.skill_items.length; i++){
            let item = this.skill_items[i];
            ctx.beginPath();
            ctx.arc(item.x, item.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            // ctx.fillRect(item.x - 2, item.y - 6, 4, 6);
        }

        ctx.font = "16px Comic Sans MS";
        ctx.fillStyle = '#424242';
        ctx.textAlign = "left";
        ctx.fillText("Press S to switch sound effects ON/OFF. Sound:", play.playBoundaries.left, play.playBoundaries.bottom + 70);

        let soundStatus = (play.sounds.muted) ? "OFF" : "ON";
        ctx.fillStyle = (play.sounds.muted) ? "#FF0000" : "#0B6121";
        ctx.fillText(soundStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);
        ctx.fillStyle = '#424242';
        ctx.textAlign = "right";
        ctx.fillText("Press P to pause", play.playBoundaries.right, play.playBoundaries.bottom + 70);

        
        ctx.textAlign = "center";
        ctx.font = "bold 24px Comic Sans MS";
        ctx.fillStyle = "#34ebc3";
        ctx.fillText("Level", play.width / 4, play.playBoundaries.top - 75);
        ctx.font = "bold 30px Comic Sans MS";
        ctx.fillText(play.level, play.width / 4, play.playBoundaries.top - 25);

        ctx.font = "bold 24px Comic Sans MS";
        ctx.fillStyle = "#34ebc3";
        ctx.fillText("Score", (play.width / 4)*3, play.playBoundaries.top - 75);
        ctx.font = "bold 30px Comic Sans MS";
        ctx.fillText(play.score, (play.width / 4)*3, play.playBoundaries.top - 25);

        ctx.fillText("Skill Weapons:", (play.width / 4), play.playBoundaries.top + 50);
        
        let bomb_cleaner_number = 0
        for (let i = 0 ; i < this.skill_weapons.length ; i++){
            if (this.skill_weapons[i].type === "bomb_cleaner"){
                bomb_cleaner_number += 1;
            }
        }
        let weapon_text = "Bomb Cleaner:" + bomb_cleaner_number;
        ctx.fillText(weapon_text, (play.width / 4), play.playBoundaries.top + 80);

        ctx.textAlign = "center";
        if (play.shields > 0){
            ctx.fillStyle = "#BDBDBD";
            ctx.font = "bold 24px Comic Sans MS";
            ctx.fillText("Shields", play.width / 2, play.playBoundaries.top - 75);
            ctx.font = "bold 30px Comic Sans MS";
            ctx.fillText(play.shields, play.width / 2, play.playBoundaries.top - 25);
        }
        else{
            ctx.fillStyle = "#ff4d4d";
            ctx.font = "bold 24px Comic Sans MS";
            ctx.fillText("WARNING", play.width / 2, play.playBoundaries.top - 75);
            ctx.fillStyle = "#BDBDBD";
            ctx.fillText("No Shields Left!", play.width / 2, play.playBoundaries.top - 25);
        }
    }

    update(play){
        const spaceship = this.spaceship;
        const spaceshipSpeed = this.spaceshipSpeed;
        const upSec = this.setting.updateSeconds;
        const bullets = this.bullets;
        const ufos = this.ufos;
        const frontLineUfos = [];

        if (play.pressedKeys["ArrowLeft"]){
            spaceship.x -= spaceshipSpeed * upSec;
        }

        if (play.pressedKeys["ArrowRight"]){
            spaceship.x += spaceshipSpeed * upSec;
        }

        if (play.pressedKeys["Space"]){
            this.shoot();
        }

        // if (play.pressedKeys["KeyD"]){
        //     console.log("keyD is pressed.")
        //     this.item_creation();
        // }

        let randomNumber = Math.floor(Math.random() * 10000);
        if (randomNumber >= 9900){
            this.item_creation();
        }

        if (play.pressedKeys["Digit1"]){
            if (this.lastWeaponTime === null || (new Date()).getTime() - this.lastWeaponTime > this.setting.weaponMinFrequency){
                console.log("Digit1 is pressed.")
                this.lastWeaponTime = (new Date()).getTime();
                for (let i = 0; i < this.skill_weapons.length; i++){
                    let weapon = this.skill_weapons[i];
                    if (weapon.type === "bomb_cleaner"){
                        console.log("bombcleaner");
                        this.bomb_cleaner();
                        this.skill_weapons.pop();
                        break;
                    }
                }
            }
        }

        if (spaceship.x > (play.playBoundaries.right)){
            spaceship.x = play.playBoundaries.right
        }

        if (spaceship.x < (play.playBoundaries.left)){
            spaceship.x = play.playBoundaries.left
        }

        for (let i = 0; i < bullets.length; i++){
            let bullet = bullets[i];
            bullet.y -= upSec * this.setting.bulletSpeed;
            if (bullet.y < 0){
                bullets.splice(i--, 1);
            }
        }

        let reachedSide = false;
        for (let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            let newX = ufo.x + this.ufoSpeed * upSec * this.direction;
            let newY = ufo.y + this.ufoSpeed * upSec * this.verticalMoving;
            if (newX > play.playBoundaries.right || newX < play.playBoundaries.left){
                this.direction *= -1;
                reachedSide = true;
                this.verticalMoving = 1;
                this.ufosAreSinking = true;
                this.horizontalMoving = 0;
            }
            if (!reachedSide){
                ufo.x = newX;
                ufo.y = newY;
            }
        }

        if (this.ufosAreSinking){
            this.ufoPresentSinkingValue += this.ufoSpeed * upSec;
            if (this.ufoPresentSinkingValue >= this.setting.ufoSinkingValue){
                this.ufosAreSinking = false;
                this.verticalMoving = 0;
                this.horizontalMoving = 1;
                this.ufoPresentSinkingValue = 0;
            }  
        }

        for (let i = 0; i < this.ufos.length; i ++){
            let ufo = this.ufos[i];
            if (!frontLineUfos[ufo.column] || frontLineUfos[ufo.column].row < ufo.row){
                frontLineUfos[ufo.column] = ufo;
            }
        }

        for(let i = 0; i < this.setting.ufoColumns; i++){
            let ufo = frontLineUfos[i];
            if (!ufo){
                continue;
            }
            let chance = this.bombFrequency * upSec;
            this.object = new Objects();
            if (chance > Math.random()){
                this.bombs.push(this.object.bomb(ufo.x, ufo.y + ufo.height /2));
            }
        }

        for (let i = 0; i < this.bombs.length; i++){
            let bomb = this.bombs[i];
            bomb.y += upSec * this.bombSpeed;
            if (bomb.y > play.height){
                this.bombs.splice(i, 1);
                i--;
            };
        }
            
        for (let i = 0; i < this.skill_items.length; i++){
            let item = this.skill_items[i];
            item.y += upSec * this.setting.skill_item_speed;
            // console.log(item.x);
            // console.log(item.y);
            if (item.y > play.height){
                this.skill_items.splice(i, 1);
                i--;
            };
        }

        for (let i = 0; i < this.skill_items.length; i++){
            let item = this.skill_items[i];
            let item_collision = false;
                if (item.x >= (spaceship.x - spaceship.width / 2) && item.x <= (spaceship.x + spaceship.width / 2) && item.y >= (spaceship.y - spaceship.height / 2) && item.y <= (spaceship.y + spaceship.height / 2)){
                    console.log(item_collision);
                    this.skill_items.splice(i, 1);
                    item_collision = true;
                }
                if (item_collision === true){
                    this.skill_weapons.push(this.object.skill_weapons("bomb_cleaner"));
                    console.log(this.skill_weapons);
                }
            }

        for (let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            let collision = false;
            for (let j = 0; j < this.bullets.length; j++){
                let bullet = this.bullets[j];
                if (bullet.x >= (ufo.x - ufo.width / 2) && bullet.x <= (ufo.x + ufo.width / 2) && bullet.y >= (ufo.y - ufo.height / 2) && bullet.y <= (ufo.y + ufo.height / 2)){
                    console.log(collision);
                    bullets.splice(j, 1);
                    j--;
                    collision = true;
                }
            }
            if (collision){
                play.sounds.playSound("ufoDeath");
                this.ufos.splice(i, 1);
                play.score = play.score + play.setting.pointsPerUfo;
                console.log(play.score);
                i--;
            }
        }
        
        for (let i = 0; i < this.bombs.length; i++){
            let bomb = this.bombs[i];
            let collision = false;
            if (bomb.x + 2 >= (spaceship.x - spaceship.width / 2) && bomb.x - 2 <= (spaceship.x + spaceship.width / 2) && bomb.y + 6 >= (spaceship.y - spaceship.height / 2) && bomb.y <= (spaceship.y + spaceship.height / 2)){
                collision = true;
                if (play.shields != 0){
                    play.shields -= 1;
                    this.bombs.splice(i, 1);
                    i--;
                    play.sounds.playSound("explosion");
                }
                else if(play.shields == 0){
                    this.bombs.splice(i, 1);
                    i--;
                    play.sounds.playSound("explosion");
                    play.goToPosition(new GameOverPosition());
                }
            }
            
        }

        for (let i = 0; i < this.ufos.length; i++){
            let ufo = this.ufos[i];
            let collision = false;
            if (ufo.x + ufo.width / 2 >= (spaceship.x - spaceship.width / 2) && ufo.x - ufo.width / 2 <= (spaceship.x + spaceship.width / 2) && ufo.y + ufo.height / 2 >= (spaceship.y - spaceship.height / 2) && ufo.y - ufo.height / 2 <= (spaceship.y + spaceship.height / 2)){
                play.sounds.playSound("explosion");
                play.goToPosition(new GameOverPosition());
                play.shields = -1;
                return;
            }
        }
        
        if (this.ufos.length == 0){
            play.level += 1;
            play.goToPosition(new TransferPosition(play.level));
        }

        if (play.sheilds < 0){
            play.goToPosition(new GameOverPosition());
        }
    }


    shoot(){
        if (this.lastBulletTime === null || (new Date()).getTime() - this.lastBulletTime > this.setting.bulletMaxFrequency){
            this.object = new Objects();
            this.bullets.push(this.object.bullet(this.spaceship.x, this.spaceship.y - this.spaceship.height / 2, this.setting.bulletSpeed));
            this.lastBulletTime = (new Date()).getTime();
            play.sounds.playSound("shot");
        }
    }

    item_creation(){
        if (this.lastShootTime === null || (new Date()).getTime() - this.lastShootTime > this.setting.skillMinFrequency){
            console.log("item creastion");
            this.object = new Objects();
            this.skill_items.push(this.object.bomb_cleaner(Math.floor(Math.random() * 700) + 100, 0, this.setting.skill_item_speed));
            this.lastShootTime = (new Date()).getTime();
        }
    }

    bomb_cleaner(){
        this.bombs.length = 0;
        console.log(this.bombs);
    }

    keyDown(play, keyboardCode){
        if (keyboardCode == "KeyS"){
            play.sounds.muteSwitch();
        }
        else if (keyboardCode == "KeyP"){
            play.pushPosition(new PausePosition());
        }
    }
}
