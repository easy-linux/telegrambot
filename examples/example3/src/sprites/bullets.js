import { Texture, Container } from "pixi.js";
import { Bullet } from "../classes/bullet";
import appConstants from "../common/constants";

let app;
let bullets;
let timeout;

const bulletTypes = ["Bullet_Sequence1", "Bullet_Sequence2"];

const allTextures = {};

export const initBullets = (currApp, root) => {
  bullets = new Container();
  bullets.name = appConstants.containers.bullets;
  app = currApp
  return bullets;
};

export const addBullet = (coord, angle) => {

  const bulletType = bulletTypes[Math.floor(Math.random() * bulletTypes.length)];

  let textures = [];
  if (allTextures[bulletType]) {
    textures = allTextures[bulletType];
  } else {
    for (let i = 0; i < 6; i++) {
      const texture = Texture.from(`${bulletType} ${i + 1}.png`);
      textures.push(texture);
    }
    allTextures[bulletType] = textures;
  }

  const buller = new Bullet({
    container: bullets, 
    x: coord.x, 
    y: coord.y,
    textures,
    angle,
  })

};
