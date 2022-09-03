// All of the cached elements variables.
const playerVitals = document.getElementById('player-vitals');
const playerAttackEffect = document.getElementById('player-attack-effect');
const enemyAttackEffect = document.getElementById('enemy-attack-effect');
const enemyVitals = document.getElementById('enemy-vitals');
const controlPanel = document.getElementById('controls');
const attackBtn = document.getElementById('attack');
const repairBtn = document.getElementById('repair');
const superBtn = document.getElementById('super');

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
        removeEnemyAttackAnimation();
        playerAttackAnimation();
        enemy.health -= randomValue(player.damage);
        playerTurn = false;
    };
    repair() {
        if (player.shield !== 0 && player.shield < 100) {
            removeEnemyAttackAnimation();
            player.shield += 50;
            playerTurn = false;
        } else if (player.shield === 100) {
            alert("You are full shields!");
        } else {
            alert("You're shields are destroyed! They cannot be repaired anymore!");
        }
    };
    super() {
        // Some code goes here.
    };
};

class EnemyShip {
    constructor() {
        this.health = 250;
        this.damage = 15;
    };
    attack() {
        removePlayerAttackAnimation();
        enemyAttackAnimation();
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
    } else if (player.shield > 100) {
        player.shield = 100;
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

    if (!playerTurn) {
        controlPanel.style.display = 'none';
    } else {
        controlPanel.style.display = 'block';
    }

    if (player.health === 0) {
        alert('You have lost!');
    } else if (enemy.health === 0) {
        alert('You have won!');
    };
};

// Need a function that allows the computer to attack.
const enemyTurn = () => {
    if (!playerTurn) {
        enemy.attack();
        render();
    }
};

// Computer turn.
setInterval(enemyTurn, 5000);

// Need a randomizer function to randomize the damage values of attacks.
const randomValue = (value) => {
    // 0.8 ----- 1.2
    return Math.floor(value * ((Math.random() * 0.4) + 0.8));
}

// Functions for attack animations.
const playerAttackAnimation = () => {
    playerAttackEffect.innerHTML = '<img src="images/red-laser.png">';
    playerAttackEffect.style.right = '60%';
    playerAttackEffect.style.bottom = '60%';
}
const removePlayerAttackAnimation = () => {
    playerAttackEffect.innerHTML = '';
    playerAttackEffect.style.right = '20%';
    playerAttackEffect.style.bottom = '20%';
}
const enemyAttackAnimation = () => {
    enemyAttackEffect.innerHTML = '<img src="images/green-laser.png">';
    enemyAttackEffect.style.left = '55%';
    enemyAttackEffect.style.top = '40%';
}
const removeEnemyAttackAnimation = () => {
    enemyAttackEffect.innerHTML = '';
    enemyAttackEffect.style.left = '20%';
    enemyAttackEffect.style.top = '30%';
}

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

superBtn.addEventListener('click', (evt) => {

});