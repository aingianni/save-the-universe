// All of the cached elements variables.
const playerVitals = document.getElementById('player-vitals');
const enemyVitals = document.getElementById('enemy-vitals');

// Global variables.
let playerTurn = true;

// I need to create two class's. One for the player ship and one for the enemy ship.
class PlayerShip {
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

class EnemyShip {
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

const player = new PlayerShip();
const enemy = new EnemyShip();

// Need a render function that will update the page with the stats of each class.
const render = (evt) => {
    playerVitals.innerHTML = `
    Health: ${player.health}
    Shields: ${player.shield}
    `;

    enemyVitals.innerHTML = `
    Health: ${enemy.health}
    Shields: ${enemy.shield}
    `;
};

// Need a function that allows the computer to attack.
const enemyTurn = (evt) => {

};