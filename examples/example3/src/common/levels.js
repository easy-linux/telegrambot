const gameLevels = [
  {
    bombSpeed: 3,
    enemySpeed: 2,
    bulletSpeed: 6,
    enemyCount: 1,
    playerLockTime: 2000,
    shotPause: 1000,
    bombProbability: 15,
    bombPause: 800,
  },
  {
    bombSpeed: 6,
    enemySpeed: 3,
    bulletSpeed: 10,
    enemyCount: 1,
    playerLockTime: 1500,
    shotPause: 800,
    bombProbability: 15,
    bombPause: 700,
  },
  {
    bombSpeed: 12,
    enemySpeed: 4,
    bulletSpeed: 22,
    enemyCount: 1,
    playerLockTime: 1000,
    shotPause: 500,
    bombProbability: 15,
    bombPause: 600,
  },
  {
    bombSpeed: 15,
    enemySpeed: 3,
    bulletSpeed: 30,
    enemyCount: 2,
    playerLockTime: 700,
    shotPause: 200,
    bombProbability: 15,
    bombPause: 500,
  },
  {
    bombSpeed: 17,
    enemySpeed: 4,
    bulletSpeed: 32,
    enemyCount: 2,
    playerLockTime: 400,
    shotPause: 200,
    bombProbability: 15,
    bombPause: 400,
  },
  {
    bombSpeed: 20,
    enemySpeed: 6,
    bulletSpeed: 35,
    enemyCount: 3,
    playerLockTime: 300,
    shotPause: 100,
    bombProbability: 20,
    bombPause: 300,
  },
  {
    bombSpeed: 20,
    enemySpeed: 8,
    bulletSpeed: 38,
    enemyCount: 4,
    playerLockTime: 40,
    shotPause: 100,
    bombProbability: 20,
    bombPause: 300,
  },
  {
    bombSpeed: 22,
    enemySpeed: 8,
    bulletSpeed: 40,
    enemyCount: 4,
    playerLockTime: 30,
    shotPause: 50,
    bombProbability: 20,
    bombPause: 200,
  },
  {
    bombSpeed: 23,
    enemySpeed: 8,
    bulletSpeed: 40,
    enemyCount: 4,
    playerLockTime: 10,
    shotPause: 50,
    bombProbability: 20,
    bombPause: 100,
  },
  {
    bombSpeed: 22,
    enemySpeed: 8,
    bulletSpeed: 40,
    enemyCount: 5,
    playerLockTime: 10,
    shotPause: 50,
    bombProbability: 20,
    bombPause: 100,
  },
];

let curentLevel = 0;

export const getLevel = () => {
  return gameLevels[curentLevel];
};

export const nextLevel = () => {
  curentLevel++;
  return getLevel();
};

export const getLevelNumber = () => {
  return curentLevel;
};

export const isLastLevel = () => {
  return getLevelNumber() === gameLevels.length - 1;
};

export const resetLevel = () => {
  curentLevel = 0;
  return getLevel();
};
