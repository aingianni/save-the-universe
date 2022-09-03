// All of the cached elements variables.
const playerVitals = document.getElementById('player-vitals');
const playerAttackEffect = document.getElementById('player-attack-effect');
const enemyAttackEffect = document.getElementById('enemy-attack-effect');
const enemyVitals = document.getElementById('enemy-vitals');
const attackBtn = document.getElementById('attack');
const repairBtn = document.getElementById('repair');

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
        enemyAttackEffect.innerHTML = '';
        enemyAttackEffect.style.left = '20%';
        enemyAttackEffect.style.top = '30%';
        playerAttackEffect.innerHTML = '<img src="images/red-laser.png">';
        playerAttackEffect.style.right = '60%';
        playerAttackEffect.style.bottom = '60%';
        enemy.health -= randomValue(player.damage);
        playerTurn = false;
    };
    repair() {
        player.shield < 100 ? player.shield += 50 : '';
        playerTurn = false;
    };
};

class EnemyShip {
    constructor() {
        this.health = 250;
        this.damage = 15;
    };
    attack() {
        playerAttackEffect.innerHTML = '';
        playerAttackEffect.style.right = '20%';
        playerAttackEffect.style.bottom = '20%';
        enemyAttackEffect.innerHTML = '<img src="images/green-laser.png">';
        enemyAttackEffect.style.left = '60%';
        enemyAttackEffect.style.top = '50%';
        if (player.shield >= 50) {
            player.shield -= randomValue(enemy.damage * 2);
        } else if (player.shield < 50) {
            player.health -= randomValue(enemy.damage/2);
            player.shield -= randomValue(enemy.damage * 2);
        } else {
            player.health -= randomValue(enemy.damage);
        }
        playerTurn = true;
    };
};

const player = new PlayerShip();
const enemy = new EnemyShip();

// Need a render function that will update the page with the stats of each class.
const render = () => {
    if (player.shield < 0) {
        player.shield = 0;
    }

    if (player.health < 0) {
        player.health = 0;
    }

    playerVitals.innerHTML = `
    Health: ${player.health}
    Shields: ${player.shield}
    `;

    enemyVitals.innerHTML = `
    Health: ${enemy.health}
    `;
};

// Need a function that allows the computer to attack.
const enemyTurn = () => {
    if (!playerTurn) {
        enemy.attack();
        render();
    }
};

setInterval(enemyTurn, 5000);

// Event listeners for player buttons.
attackBtn.addEventListener('click', (evt) => {
    if (playerTurn) {
        player.attack();
        render();
    }
});

repairBtn.addEventListener('click', (evt) => {
    if (playerTurn) {
        player.repair();
        render();
    }
});

// Need a randomizer function to randomize the damage values of attacks.
const randomValue = (value) => {
    // 0.8 ----- 1.2
    return Math.floor(value * ((Math.random() * 0.4) + 0.8));
}