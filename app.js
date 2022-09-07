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
const playerShipDiv = document.getElementById('player');
const enemyShipDiv = document.getElementById('enemy');
const enemyDamageDis = document.getElementById('enemy-damage-display');
const playerShieldDis = document.getElementById('player-shield-display');
const playerDamageDis = document.getElementById('player-damage-display');

// Global variables.
let playerTurn = true;
let endGame = false;
let playerStatus = true;
let superDamage = 50;
let currentAlienInd = 0;
let resetCounter = 0;
let alienImages = ['images/alien-one.png', 'images/alien-two.png', 'images/alien-three.png', 'images/alien-four.png', 'images/alien-five.png']

// I need to create two class's. One for the player ship and one for the enemy ship.
class PlayerShip {
    constructor(health, maxHealth, maxShield, damage) {
        this.health = health;
        this.maxHealth = maxHealth;
        this.damage = damage;
        this.maxShield = maxShield;
        this.shield = 100;
        this.energy = 0;
    };
    attack(comp) {
        removeEnemyAttackAnimation();
        playerAttackAnimation();
        removeDamageNumberEnemy();
        removeShieldNumberPlayer();
        let currentDamage = randomValue(this.damage);
        enemyDamageDis.innerHTML = `${currentDamage}`;
        enemyDamageDis.style.opacity = '0';
        enemyDamageDis.style.top = '0';
        comp.health -= currentDamage;
        this.energy += 1;
        playerTurn = false;
        render();
    };
    repair() {
        if (this.shield !== 0 && this.shield < this.maxShield) {
            removeEnemyAttackAnimation();
            removeDamageNumberEnemy();
            removeShieldNumberPlayer();
            document.getElementById('shield-overlay').style.animation = 'shield-fade 1s 1';
            this.shield += (this.maxShield / 2);
            playerTurn = false;
            render();
        } else if (this.shield === this.maxShield) {
            openModel();
            modalBox.innerHTML = "<h1>Shields are at max!</h1><br><h6><em>Click anywhere to close.</em></h6>";
        } else {
            openModel();
            modalBox.innerHTML = "<h1>You're shields are destroyed!</h1><br><h6><em>Click anywhere to close.</em></h6>";
        };
    };
    super(comp) {
        if (this.energy === 10) {
            removeEnemyAttackAnimation();
            playerAttackAnimation();
            removeDamageNumberEnemy();
            removeShieldNumberPlayer();
            let currentDamage = randomValue(superDamage);
            enemyDamageDis.innerHTML = `${currentDamage}`;
            enemyDamageDis.style.opacity = '0';
            enemyDamageDis.style.top = '0';
            comp.health -= currentDamage;
            this.energy = 0;
            document.getElementById('super').style.animation = '';
            playerTurn = false;
            render();
        } else {
            openModel();
            modalBox.innerHTML = "<h1>Super energy too low!</h1><br><h3>Need 10 super energy to use!</h3><br><h6><em>Click anywhere to close.</em></h6>";
        };
    };
};

class EnemyShip {
    constructor(name, health, maxHealth, damage) {
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
        this.damage = damage;
    };
    attack(user) {
        removePlayerAttackAnimation();
        enemyAttackAnimation();
        removeDamageNumberPlayer();
        document.getElementById('shield-overlay').style.animation = '';
        if (user.shield >= (user.maxShield / 2)) {
            let shieldValue = randomValue(this.damage * 2);
            if (player.shield > 0) {
                playerShieldDis.innerHTML = `${shieldValue}`;
                playerShieldDis.style.opacity = '0';
                playerShieldDis.style.bottom = '60%';
            }
            user.shield -= shieldValue;
        } else if (player.shield < (user.maxShield / 2) && player.shield >= 1) {
            let damageWithShield = randomValue(this.damage/2);
            let shieldValue = randomValue(this.damage * 2);
            playerDamageDis.innerHTML = `${damageWithShield}`;
            playerDamageDis.style.opacity = '0';
            playerDamageDis.style.bottom = '60%';
            if (player.shield > 0) {
                playerShieldDis.innerHTML = `${shieldValue}`;
                playerShieldDis.style.opacity = '0';
                playerShieldDis.style.bottom = '60%';
            }
            user.health -= damageWithShield;
            user.shield -= shieldValue;
        } else if (player.shield < 1) {
            let currentDamage = randomValue(this.damage);
            playerDamageDis.innerHTML = `${currentDamage}`;
            playerDamageDis.style.opacity = '0';
            playerDamageDis.style.bottom = '60%';
            user.health -= currentDamage;
        };
        playerTurn = true;
        render();
    };
};

let currentEnemy = 0;
const player = new PlayerShip(100, 100, 100, 12);
let enemyFleet = [new EnemyShip('Screon the Destroyer', 150, 150, 15), new EnemyShip('Kratheon the Conquerer', 250, 250, 25), new EnemyShip('Blaiid the Raveger', 450, 450, 30), new EnemyShip('Rolait the Defiler', 750, 750, 40), new EnemyShip('Godrey the Lord', 1200, 1200, 55)];
let enemy = enemyFleet[currentEnemy];

// Need a render function that will update the page with the stats of each class.
const render = () => {

    // Logic to make sure stats are right.
    if (player.shield < 0) {
        player.shield = 0;
    } else if (player.shield > player.maxShield) {
        player.shield = player.maxShield;
    };

    if (player.health < 0) {
        player.health = 0;
    } else if (enemy.health < 0) {
        enemy.health = 0;
    }

    if (player.energy > 10) {
        player.energy = 10;
    } else if (player.energy === 10) {
        document.getElementById('super').style.animation = 'pulse 2s infinite';
    } else {
        document.getElementById('super').style.animation = '';
    }

    // Updates stats on page.
    document.getElementById('health-level').innerHTML = `Health: ${player.health}`;
    document.getElementById('shield-level').innerHTML = `Shields: ${player.shield}`;
    document.getElementById('super').innerText = `Super: ${player.energy}`;

    // Enemy health bar.
    enemyVitals.style.background = `linear-gradient(90deg, rgba(0,89,255,0.4) 0%, rgba(111,0,255,1) ${(enemy.health/enemy.maxHealth) * 100}%, rgba(0, 37, 104, 0.736) ${(enemy.health/enemy.maxHealth) * 100}%`;
    enemyVitals.innerText = `${enemy.name}`

    // Check whos turn it is to apply wiggle animation.
    if (!playerTurn) {
        document.getElementById('player').classList.remove('turn');
        document.getElementById('enemy').classList.add('turn');
        controlPanel.style.visibility = 'hidden';
        controlPanel.style.opacity = '0';
    } else {
        document.getElementById('enemy').classList.remove('turn');
        document.getElementById('player').classList.add('turn');
        controlPanel.style.visibility = 'visible';
        controlPanel.style.opacity = '1';
    };

    // Win conditions.
    if (player.health === 0) {
        endGame = true;
        playerStatus = false;
        playerShipDiv.innerHTML = '<img src="images/explode.png">'
        setTimeout(openModel, 1000);
        modalBox.innerHTML = '<h1>You have lost!<h1><br><h6><em>Click anywhere to reset the game.</em></h6>';
    } else if (enemy.health === 0 && currentEnemy === enemyFleet.length-1) {
        playerTurn = true;
        endGame = true;
        playerStatus = false;
        enemyShipDiv.innerHTML = '<img src="images/explode.png">'
        setTimeout(openModel, 1000);
        modalBox.innerHTML = `
        <h1>You have won!</h1>
        <br>
        <h2>You have successfully destroyed the enemy fleet!</h2>
        <br>
        <h6><em>Click anywhere to reset the game.</em></h6>
        `;
    } else if (enemy.health === 0) {
        playerTurn = true;
        endGame = true;
        enemyShipDiv.innerHTML = '<img src="images/explode.png">'
        setTimeout(openModel, 1000);
        modalBox.innerHTML = `
        <h1>You have won!</h1>
        <br>
        <h5><em>Try your luck against the next boss?</em></h5>
        <ul>
            <li>Health increase: 25 <em>percent</em></li>
            <li>Shield increase: 20 <em>percent</em></li>
            <li>Damage increase: 10 <em>percent</em></li>
            <li>Super increase: 20 <em>damage</em></li>
        </ul>
        <br>
        <button id="continue">Continue</button>
        `;
        document.getElementById('continue').addEventListener('click', (evt) => {
            currentEnemy++;
            enemy = enemyFleet[currentEnemy];
            continueGame();
        });
    };

    // Add event listener to modal, changes based on the endGame boolean.
    modalTemp.addEventListener('click', () => {
        if (!endGame) {
            modalTemp.style.display = 'none';
        } else if (endGame && !playerStatus) {
            currentEnemy = 0;
            // enemy = enemyFleet[currentEnemy];
            currentAlienInd = 0;
            reset();
        }
    });
};

setTimeout(render, 10);

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
    player.maxHealth = 100;
    player.shield = 100;
    player.maxHealth = 100;
    player.damage = 12;
    player.energy = 0;
    enemyFleet = [new EnemyShip('Screon the Destroyer', 150, 150, 15), new EnemyShip('Kratheon the Conquerer', 250, 250, 25), new EnemyShip('Blaiid the Raveger', 450, 450, 30), new EnemyShip('Rolait the Defiler', 750, 750, 40), new EnemyShip('Godrey the Lord', 1200, 1200, 55)];
    enemy = enemyFleet[currentEnemy];
    endGame = false;
    playerTurn = true;
    playerShipDiv.innerHTML = `<img class="player-ship" src="images/player-ship-one.png" alt="This is the player's ship.">`;
    enemyShipDiv.innerHTML = `<img class="enemy-ship" src="${alienImages[currentAlienInd]}" alt="This is the enemy's ship.">`;
    removeEnemyAttackAnimation();
    removePlayerAttackAnimation();
    render();
};

const continueGame = () => {
    player.maxHealth = Math.floor((player.maxHealth + (player.maxHealth * .25)));
    player.health = player.maxHealth;
    player.maxShield = Math.floor((player.maxShield + (player.maxShield * .20)));
    player.shield = player.maxShield;
    player.damage += Math.floor((player.damage + (player.damage * .10)));
    player.energy = 0;
    superDamage += 20;
    endGame = false;
    playerTurn = true;
    currentAlienInd++;
    playerShipDiv.innerHTML = `<img class="player-ship" src="images/player-ship-one.png" alt="This is the player's ship.">`;
    enemyShipDiv.innerHTML = `<img class="enemy-ship" src="${alienImages[currentAlienInd]}" alt="This is the enemy's ship.">`;
    removeEnemyAttackAnimation();
    removePlayerAttackAnimation();
    render();
}

// Open model function.
const openModel = () => {
    modalTemp.style.display = 'block';
}

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

// Functions for damage numbers.
const removeDamageNumberPlayer = () => {
    enemyDamageDis.innerHTML = '';
    enemyDamageDis.style.opacity = '1';
    enemyDamageDis.style.top = '5%';
}
const removeDamageNumberEnemy = () => {
    playerDamageDis.innerHTML = ``;
    playerDamageDis.style.opacity = '1';
    playerDamageDis.style.bottom = '55%';
}
const removeShieldNumberPlayer = () => {
    playerShieldDis.innerHTML = ``;
    playerShieldDis.style.opacity = '1';
    playerShieldDis.style.bottom = '55%';
}

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