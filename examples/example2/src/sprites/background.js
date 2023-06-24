import { Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { getLevelNumber } from "../common/levels";
import { allTextureKeys } from "../common/textures";

let app;
let rootContainer;
let background

export const addBackground = (currApp, root) => {
  app = currApp;
  rootContainer = root

  background = new Sprite(getTexture(allTextureKeys.background1))
  background.name = appConstants.containers.background
  
  background.width = appConstants.size.WIDTH 
  background.height = appConstants.size.HEIGHT

  rootContainer.addChild(background)

  return background;
};

export const setBackgroundForLevel = () => {
  const level = getLevelNumber()
  background.texture = getTexture(allTextureKeys[`background${level+1}`])
}
