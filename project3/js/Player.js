'use strict'

// Player setup variables
const playerHealth = 200;
const playerSpeed = 5;

const spritePath = "images/StickMain.png";
const attackSpritePath = "images/bloodSlash.png";

// Attack variables
let attackTime = 0;
const attackAnimEnd = 0.1;
const attackCooldown = 1.5;

// Sound FX
let attackSound = new Howl({
    src: ['sounds/attackSound.wav']
});

let hitSound = new Howl({
    src: ['sounds/hitSound.wav']
});

/* The player class will be an entity that is controlled by the player with the 'WASD' keys and 
* has its own update function to support movment throught the scene.
*/
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, playerSpeed, playerHealth);

        // Set the player's sprite 
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(spritePath));
        this.sprite.x = this.pos.x; // Position values set to the x and y values given
        this.sprite.y = this.pos.y;
        this.sprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite.

        // Set the Sprite for attack animations
        this.attackSprite = new PIXI.Sprite(PIXI.Texture.from(attackSpritePath));
        this.attackSprite.x = this.pos.x; // Position values set to the x and y values given
        this.attackSprite.y = this.pos.y;
        this.attackSprite.scale.set(1);
        this.attackSprite.anchor.set(0.5, 0.5); // set the anchor to the center of the sprite.
    
        gameScene.addChild(this.sprite);
        gameScene.addChild(this.attackSprite);

        this.attackSprite.visible = false;
        
        /* Object with all of the keys the player can use.
        *
        * This works by setting the keys to true when they are pressed and setting them to false
        * when they are released
        * */
        this.keys = {
            W: false,
            A: false,
            S: false,
            D: false
        };

        // Object that contains the two types of clicks
        this.clicks = {
            LEFT: false,
            RIGHT: false
        };
    }
    // Sets up the controls for the player
    setup() {
        // Add event listeners for keydown and keyup
        window.addEventListener('keydown', (k) => this.keyPressed(k));
        window.addEventListener('keyup', (k) => this.keyReleased(k));
   
        // Add event listeners for mousedown and mouseup
        window.addEventListener('mousedown', (mb) => this.mousePressed(mb));
        window.addEventListener('mouseup', (mb) => this.mouseReleased(mb));
    }
    
    // Called when a key is pressed and activates the key in question.
    keyPressed(k) {
        this.keys[k.key.toUpperCase()] = true;
    }

    // Called when the key is released and deactivates the key in question.
    keyReleased(k) {
        this.keys[k.key.toUpperCase()] = false;
    }
    
    //Called when mouse buttons are pressed and adjusts the clicks where needed.
    mousePressed(mb) {
        switch (mb.buttons) {
            case 1:
                this.clicks.LEFT = true;
                break;

            case 2:
                this.clicks.RIGHT = true;
                break;

            case 3:
                this.clicks.LEFT = true;
                this.clicks.RIGHT = true;
                break;
        }
    }

    //Called when mouse buttons are released and adjusts the clicks where needed.
    mouseReleased(mb) {
        switch (mb.buttons) {
            case 2:
                this.clicks.LEFT = false;
                break;

            case 1:
                this.clicks.RIGHT = false;
                break;

            case 0:
                this.clicks.LEFT = false;
                this.clicks.RIGHT = false;
                break;
        }
    }

    
    // Move the player across the screen
    move() {
        this.movement = new Vector2(0, 0);
        // Checks for movement keys and applies logic accordingly
        if (this.keys.W) {
            this.movement.y += -1; 
        }

        if (this.keys.S) {
            this.movement.y += 1;
        }

        if (this.keys.D) {
            this.movement.x += 1;
        }

        if (this.keys.A) {
            this.movement.x += -1;
        }

        //Set the movement vector magnitude equal to the speed.
        if (this.movement.magnitude() != 0) {
        this.movement = this.movement.normalized().multiply(this.speed);
        }

        //this.pos.x += this.movement.x;
        //this.pos.y += this.movement.y;
        this.pos = this.pos.add(this.movement);
        this.sprite.x += this.movement.x;
        this.sprite.y += this.movement.y;

        // Move the attack sprite as well.
        this.attackSprite.x = this.pos.x;
        this.attackSprite.y = this.pos.y;
    }

    //Attacks in a 360 radius dealing damage
    attack(enemies) {
        if (!this.attackSprite.visible && attackTime == 0) {
            if (this.clicks.LEFT) {
                this.attackSprite.visible = true;
                attackSound.play();

                for (let i = 0; i < enemies.length; i++) {
                    if (enemies[i].pos.dist(player.pos) < 150) {
                        enemies[i].takeDamage();
                        hitSound.play();
                    }
                }
            }
        }

        else if (this.attackSprite.visible && attackTime >= 0 && attackTime < attackAnimEnd) {
            attackTime += 0.01;
            this.attackSprite.scale.set(attackTime * 20);
        }

        else if (this.attackSprite.visible && attackTime >= attackAnimEnd) {
            this.attackSprite.visible = false;
            attackTime += 0.01;
        }

        else if (!this.attackSprite.visible && attackTime > attackAnimEnd && attackTime < attackCooldown) {
            attackTime += 0.01;
        }

        else if (attackTime >= attackCooldown) {
            attackTime = 0;
            this.attackSprite.visible = false;
        }
    }

    //Subtracts damage done from the health
    takeDamage(damage) {
        this.health -= damage;
    }

    // Function to be called to check for all changes that the player recieves each round.
    update(enemies) {
        this.move();
        this.attack(enemies);
    }
}