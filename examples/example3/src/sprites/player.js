import appConstants from "../common/constants";
import { Player } from "../classes/player";

let player;
let app;

export const addPlayer = (currApp, root) => {
  app = currApp;
  
  player = new Player({container: root, x: appConstants.size.WIDTH / 2, y: appConstants.size.HEIGHT - 200, app: currApp})
  
  return player;
};

export const getPlayer = () => player;
