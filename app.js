// All of the cached elements variables.

// Global variables.
let playerTurn = true;

// I need to create two class's. One for the player ship and one for the enemy ship.
class playerShip {
    constructor() {
        this.health = 100;
        this.damage = 10;
        this.shield = 100;
    };
    attack() {
        // Some code goes here.
    };
    repair() {
        // Some code goes here.
    };
};

class enemyShip {
    constructor() {
        this.health = 500;
        this.damage = 25;
        this.shield = 100;
    };
    attack() {
        // Some code goes here.
    };
    repair() {
        // Some code goes here.
    };
};

// Need a render function that will update the page with the stats of each class.
const render = (evt) => {

};