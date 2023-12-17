'use strict'

//Vector2 Class becasue I lost my mind
class Vector2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    // Returns the magnitude of the current Vector2
    magnitude() {
        return Math.sqrt(
            Math.pow(this.x, 2) + 
            Math.pow(this.y, 2)
            );
    }

    // Returns a normalized version of the current Vector2
    normalized() {
        if (this.magnitude != 0) { 
            return new Vector2(
               this.x / this.magnitude(),
                this.y / this.magnitude()
            );
        }

        else {
            this.x = 0;
            this.y = 0;
        }
    }

    //Returns the counter-clockwise angle of the current Vector2 
    angle() {
        return Math.atan(this.y / this.x) * 
        (180 / Math.PI);
    }

    // Returns the product of the current Vector2 and the scalar quantity.
    multiply(scale) {
        return new Vector2(
            this.x * scale,
            this.y * scale
        );
    }

    // Returns the sum of the current and parameter Vector2.
    add(vec2) {
        if (vec2 instanceof Vector2) {
            return new Vector2(
                this.x + vec2.x,
                this.y + vec2.y
            );
        }
        
        else {
            console.log("A Vector2 was not passed as the parameter.");
        }
    }

    // Returns the difference of the current and parameter Vector2.
    subtract(vec2) {
        if (vec2 instanceof Vector2) {
            return new Vector2(
                this.x - vec2.x,
                this.y - vec2.y
            );
        }

        else {
            console.log("A Vector2 was not passed as the parameter.");
        }
    }

    // Returns the dot product of the currecnt and parameter Vector2
    dot(vec2) {
        if (vec2 instanceof Vector2) {
            return this.x * vec2.x + this.y * vec2.y;
        }

        else {
            console.log("A Vector2 was not passed as the parameter.");
        }
    }

    // Returns the distance between two vectors
    dist(vec2) {
        if (vec2 instanceof Vector2) {
            return this.subtract(vec2).magnitude();
        }

        else {
            console.log("A Vector2 was not passed as the parameter.");
        }
    }
}