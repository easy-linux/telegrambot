const appConstants = {
    size: {
        WIDTH: window.innerWidth ? window.innerWidth : 800,
        HEIGHT: window.innerHeight ? window.innerHeight : 600,
    },
    containers: {
        player: 'player',
        bullets: 'bullets',
        people: 'people',
        enemies: 'enemies',
        bombs: 'bombs',
        explosions: 'explosions',
        infoPanel: 'infoPanel',
        background: 'background',
    },
    timeouts: {
        playerLock: 2000,
        playerShoots: 100,
    },
    probability: {
        enemyChangeDirection: 1,
        bomb: 3,
    },
    events: {
        infoUpdated: 'indoUpdated',
        ufoDestroyed: 'ufoDestroyed',
        manKilled: 'manKilled',
        bombDestroyed: 'bombDestroyed',
        youWin: 'youWin',
        levelMessage: 'levelMessage',
        gameOver: 'gameOver',
        restartGame: 'restartGame',
        resetPeople: 'resetPeople',
        tick: 'tick',
        collision: 'collision'
    },
    sounds: {
        shot: 'shot',
        miss: 'miss',
        explosion: 'explosion',
        gameOver: 'gameOver',
        youWin: 'youWin',
        background: 'background',
    },
    spriteType: {
        player: 'player',
        bullet: 'bullet',
        man: 'man',
        tombStone: 'tombStone',
        bomb: 'bomb',
    },
}

export default appConstants