import { getRandomAlivePerson } from "./people";
import { allTextureKeys } from "../common/textures";
import { getTexture } from "../common/assets";
import { Container } from "pixi.js";
import appConstants from "../common/constants";
import { randomIntFromInterval } from "../common/utils";
import { Enemy } from "../classes/enemy";
import { getLevel } from "../common/levels";

let enemies;
let app;
let rootContainer;

export const initEnemies = (currApp, root) => {
  enemies = new Container();
  enemies.name = appConstants.containers.enemies;
  app = currApp;
  rootContainer = root;
  return enemies;
};

export const addEnemies = () => {
  const textures = [getTexture(allTextureKeys.shipBlue), getTexture(allTextureKeys.shipBlue2)];

  const curentLevel = getLevel();
  const y = 80;
  for (let i = 0; i < curentLevel.enemyCount; i++) {
    const alivePerson = getRandomAlivePerson();
    let x;
    if (alivePerson) {
      x = alivePerson;
    } else {
      x = randomIntFromInterval(20, appConstants.size.WIDTH - 20);
    }

    const enemy = new Enemy({ container: rootContainer, x, y: y + 30 * i, textures });
  }
};

export const addEnemy = (y) => {
  const textures = [getTexture(allTextureKeys.shipBlue), getTexture(allTextureKeys.shipBlue2)];

  const curentLevel = getLevel();
  //const y = 80;
  const count = enemies.children.length;
  if (curentLevel.enemyCount > count) {
    const alivePerson = getRandomAlivePerson();
    let x;
    if (alivePerson) {
      x = alivePerson;
    } else {
      x = randomIntFromInterval(20, appConstants.size.WIDTH - 20);
    }

    const enemy = new Enemy({ container: rootContainer, x, y, textures });
  }
};
