// All of the cached elements variables.
const playerVitals = document.getElementById('player-vitals');
const playerAttackEffect = document.getElementById('player-attack-effect');
const enemyAttackEffect = document.getElementById('enemy-attack-effect');
const enemyVitals = document.getElementById('enemy-vitals');
const controlPanel = document.getElementById('controls');
const attackBtn = document.getElementById('attack');
const repairBtn = document.getElementById('repair');
const superBtn = document.getElementById('super');
const modalTemp = document.getElementById('modal-template');
const modalBox = document.getElementById('modal-box');

// Global variables.
let playerTurn = true;
let endGame = false;

// I need to create two class's. One for the player ship and one for the enemy ship.
class PlayerShip {
    constructor() {
        this.health = 100;
        this.damage = 12;
        this.shield = 100;
        this.energy = 0;
    };
    attack(comp) {
        removeEnemyAttackAnimation();
        playerAttackAnimation();
        comp.health -= randomValue(this.damage);
        this.energy += 1;
        playerTurn = false;
        render();
    };
    repair() {
        if (this.shield !== 0 && this.shield < 100) {
            removeEnemyAttackAnimation();
            this.shield += 50;
            playerTurn = false;
            render();
        } else if (this.shield === 100) {
            modalTemp.style.display = 'block';
            modalBox.innerHTML = "<h1>Shields are at max!</h1><br><h6><em>Click anywhere to close.</em></h6>";
        } else {
            modalTemp.style.display = 'block';
            modalBox.innerHTML = "<h1>You're shields are destroyed! They cannot be repaired anymore!</h1><br><h6><em>Click anywhere to close.</em></h6>";
        };
    };
    super(comp) {
        if (this.energy === 10) {
            removeEnemyAttackAnimation();
            playerAttackAnimation();
            comp.health -= randomValue(50);
            this.energy = 0;
            playerTurn = false;
            render();
        } else {
            modalTemp.style.display = 'block';
            modalBox.innerHTML = "<h1>Super energy too low!</h1><br><h6><em>Click anywhere to close.</em></h6>";
        };
    };
};

class EnemyShip {
    constructor() {
        this.health = 250;
        this.damage = 15;
    };
    attack(user) {
        removePlayerAttackAnimation();
        enemyAttackAnimation();
        if (user.shield >= 50) {
            user.shield -= randomValue(this.damage * 2);
        } else if (player.shield < 50) {
            user.health -= randomValue(this.damage/2);
            user.shield -= randomValue(this.damage * 2);
        } else {
            user.health -= randomValue(this.damage);
        };
        playerTurn = true;
        render();
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
    };

    if (player.health < 0) {
        player.health = 0;
    } else if (enemy.health < 0) {
        enemy.health = 0;
    }

    if (player.energy > 10) {
        player.energy = 10;
    }

    playerVitals.innerHTML = `
    Health: ${player.health}
    Shields: ${player.shield} <br>
    Super: ${player.energy}
    `;

    enemyVitals.innerHTML = `
    Health: ${enemy.health}
    `;

    if (!playerTurn) {
        document.querySelector('.player-ship').classList.remove('turn');
        document.querySelector('.enemy-ship').classList.add('turn');
        controlPanel.style.visibility = 'hidden';
    } else {
        document.querySelector('.enemy-ship').classList.remove('turn');
        document.querySelector('.player-ship').classList.add('turn');
        controlPanel.style.visibility = 'visible';
    };

    if (player.health === 0) {
        endGame = true;
        modalTemp.style.display = 'block';
        modalBox.innerHTML = '<h1>You have lost!<h1><br><h6><em>Click anywhere to reset the game.</em></h6>';
    } else if (enemy.health === 0) {
        endGame = true;
        modalTemp.style.display = 'block';
        modalBox.innerHTML = '<h1>You have won!</h1><br><h6><em>Click anywhere to reset the game.</em></h6>';
    };

    modalTemp.addEventListener('click', () => {
        if (!endGame) {
            modalTemp.style.display = 'none';
        } else {
            reset();
        }
    });
};

setTimeout(render, 10)

// ==============================
// ======== Functions ===========
// ==============================

// Need a function that allows the computer to attack.
const enemyTurn = () => {
    if (!playerTurn) {
        enemy.attack(player);
    }
};

// Reset the game.
const reset = () => {
    player.health = 100;
    player.shield = 100;
    player.energy = 0;
    enemy.health = 250;
    endGame = false;
    playerTurn = true;
    removeEnemyAttackAnimation();
    removePlayerAttackAnimation();
    render();
};

// Computer turn.
setInterval(enemyTurn, 3000);

// Need a randomizer function to randomize the damage values of attacks.
const randomValue = (value) => {
    // 0.8 ----- 1.2
    return Math.floor(value * ((Math.random() * 0.4) + 0.8));
};

// Functions for attack animations.
const playerAttackAnimation = () => {
    playerAttackEffect.innerHTML = '<img src="images/red-laser.png">';
    playerAttackEffect.style.right = '60%';
    playerAttackEffect.style.bottom = '60%';
    playerAttackEffect.style.opacity = '0';
}
const removePlayerAttackAnimation = () => {
    playerAttackEffect.innerHTML = '';
    playerAttackEffect.style.right = '20%';
    playerAttackEffect.style.bottom = '20%';
    playerAttackEffect.style.opacity = '1';
}
const enemyAttackAnimation = () => {
    enemyAttackEffect.innerHTML = '<img src="images/green-laser.png">';
    enemyAttackEffect.style.left = '65%';
    enemyAttackEffect.style.top = '40%';
    enemyAttackEffect.style.opacity = '0';
}
const removeEnemyAttackAnimation = () => {
    enemyAttackEffect.innerHTML = '';
    enemyAttackEffect.style.left = '20%';
    enemyAttackEffect.style.top = '30%';
    enemyAttackEffect.style.opacity = '1';
};

// ==============================
// ===== Event Listeners ========
// ==============================

// Event listeners for player buttons.
attackBtn.addEventListener('click', (evt) => {
    if (playerTurn) {
        player.attack(enemy);
    }
    render();
});

repairBtn.addEventListener('click', (evt) => {
    if (playerTurn) {
        player.repair();
    }
    render();
});

superBtn.addEventListener('click', (evt) => {
    if (playerTurn) {
        player.super(enemy);
    };
    render();
});