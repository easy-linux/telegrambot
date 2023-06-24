import { Container } from "pixi.js";
import { Bomb } from "../classes/bomb";
import appConstants from "../common/constants";
import { getLevel } from "../common/levels";

let app;
let bombs;
let rootContainer;

export const initBombs = (currApp, root) => {
  bombs = new Container();
  bombs.name = appConstants.containers.bombs;
  app = currApp;
  rootContainer = root;
  return bombs;
};

let bombTimeout = null

export const addBomb = (coord, target) => {
  if(bombTimeout){
    return
  }
  const level = getLevel()
  bombTimeout = setTimeout(() => {
    bombTimeout = null
  }, level.bombPause)

  const man = new Bomb({container: bombs, x: coord.x, y: coord.y + 20, target})
};

