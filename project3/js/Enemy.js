'use strict'

let shamblerSpritePath = "images/Shambler.png";

// Shambler variables
let shamblerHealth = 2;
let shamblerSpeed = 0.1;

/* A basic enemy class to give to all the enemies in the game. It will contain details for 
* approaching the player and seeking them out.
*/ 
class Enemy extends GameObject{
    constructor(x, y, enemySprites, speed, health) {
        super(x, y, speed, health);
    }
}

/* The basic ranged class that throws a single projectile at the player from a mid range distance.
*/
class Ranger extends Enemy {
    constructor(x, y, enemySprites, speed, health) {
        super(x, y, speed, health);
    }

    update() {
        super.update();
    }
}

/* The basic melee enemy which trys to get right up against the player and damages them.
*/
class Shambler extends Enemy {
    constructor(x, y) {
        super(x, y, shamblerSpeed, shamblerHealth);

        this.died = false;
        this.health = 2;

        // Vector to seek out the player
        this.seekVec = new Vector2(0, 0);

        this.sprite = new PIXI.Sprite(PIXI.Texture.from(shamblerSpritePath));
        this.sprite.x = this.pos.x; // Position values set to the x and y values given
        this.sprite.y = this.pos.y;
        this.sprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite.

        gameScene.addChild(this.sprite);
    }
    
    move(player) {
        if (player instanceof Player) {
            this.seekVec = player.pos.subtract(this.pos);
            this.seekVec = this.seekVec.normalized().multiply(1);

            this.pos = this.pos.add(this.seekVec);
            this.sprite.x += this.seekVec.x;
            this.sprite.y += this.seekVec.y;
        }

        else {
            console.log("Object passed as parameter is not a Player.");
        }
    }

    damagePlayer(player) {
        if (this.pos.dist(player.pos) < 30) {
            player.takeDamage(1);
        }
    }

    takeDamage() {
        this.health -= 1;
        if (this.health <= 0) {
            this.died = true;
        }
    }

    update(player, deltaTime) {
        this.move(player, deltaTime);
        this.damagePlayer(player);
    }
}

/* The advanced ranged class of enemy which approaches the enemy from further away and launches a
* splitting projectile.
*/
class DarkMage extends Enemy {
    constructor(x, y, enemySprites, speed, health) {
        super(x, y, speed, health);
    }
}