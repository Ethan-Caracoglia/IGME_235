'use strict'

/* General Game Object class which will store things that will be consistent among all objects in 
* the scene such as a sprite and position.
*/
class GameObject {
    constructor(x, y, speed, health) {
        // Set the postion of the object
        this.pos = new Vector2(x, y);

        //Set the movement vector to (0, 0) and the speed.
        this.movement = new Vector2(0, 0);
        this.speed = speed;
        this.health = health;
    }
}