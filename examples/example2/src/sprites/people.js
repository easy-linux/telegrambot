import { Container } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { allTextureKeys } from "../common/textures";
import { randomIntFromInterval } from "../common/utils";
import { resetPeople } from "../common/eventHub";
import { Man } from '../classes/man'

let app;
let rootContainer;
let people;
let aliveCoords = [];
let peopleFrames = null;
let tombStoneFrames = null;

export const initPeople = (currApp, root) => {
  if (!peopleFrames) {
    peopleFrames = [getTexture(allTextureKeys.man), getTexture(allTextureKeys.man2), getTexture(allTextureKeys.woman)];
  }
  if (!tombStoneFrames) {
    tombStoneFrames = [getTexture(allTextureKeys.TombStone1), getTexture(allTextureKeys.TombStone2)];
  }
  people = new Container();
  people.name = appConstants.containers.people;
  app = currApp;
  rootContainer = root;
  return people;
};

let x = 10;
let y = appConstants.size.HEIGHT;

export const recalculateAlivePeople = () => {
  const result = [];
  people.children.forEach((p) => {
    if (p.alive) {
      result.push(p.position.x);
    }
  });
  aliveCoords = [...result];
};

export const restorePeople = () => {
  aliveCoords.length = 0;
  x = 30;
  y = appConstants.size.HEIGHT;

  let i = 0;

  while (x < appConstants.size.WIDTH) {
    const man = new Man({container: people, x, y, peopleFrames, tombStoneFrames})
    x += man.width + 10;
    i++
  }
  resetPeople({count: people.children.length})
  recalculateAlivePeople();
};


export const getAlivePeople = () => {
  return [...aliveCoords];
};

export const getRandomAlivePerson = () => {
  const allAlive = getAlivePeople();
  if (allAlive.length) {
    return allAlive[randomIntFromInterval(0, allAlive.length-1)];
  }
  return null;
};