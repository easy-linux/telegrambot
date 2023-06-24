import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { EventHub, gameOver, youWin } from "../common/eventHub";
import { getLevel } from "../common/levels";
import { muteEffects, pause, play, unMuteEffects } from "../common/sound";
import { allTextureKeys } from "../common/textures";

let info;
let app;

let ufoText;
let manText;

let ufoCount = 0;
let manCount = 0;

let musicOff;
let musicOffStatus = true;

let effectsOff;
let effectsOffStatus = true;

let ufoMaxCount = 10

const style = new TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fontStyle: "normal",
  fontWeight: "bold",
  fill: ["#ffffff", "#00ff99"], // <- gradient
  stroke: "#4a1850",
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: "round",
});

export const initInfo = (currApp, root) => {
  const musicOffTexture = getTexture(allTextureKeys.musicOff);
  const musicOnTexture = getTexture(allTextureKeys.musicOn);
  const effectsOffTexture = getTexture(allTextureKeys.effectsOff);
  const effectsOnTexture = getTexture(allTextureKeys.effectsOn);

  info = new Container();
  info.name = appConstants.containers.infoPanel;

  app = currApp;

  const infoPanel = new Container();

  infoPanel.position.x = 20;
  infoPanel.position.y = 100;

  const graphics = new Graphics();
  graphics.lineStyle(1, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(0, 0, 150, 100, 16);
  graphics.endFill();
  infoPanel.addChild(graphics);

  const ufo = new Sprite(getTexture(allTextureKeys.enemyShip));
  ufo.anchor.set(0, 0.5);
  ufo.scale.set(0.5);
  ufo.name = "ufo";
  ufo.x = 20;
  ufo.y = 30;

  infoPanel.addChild(ufo);

  ufoText = new Text("0", style);
  ufoText.anchor.set(0.5);
  ufoText.x = 100;
  ufoText.y = 30;
  ufoText.name = "ufotext";
  infoPanel.addChild(ufoText);

  ///
  const man = new Sprite(getTexture(allTextureKeys.man));
  man.anchor.set(0, 0.5);
  man.scale.set(0.8);
  man.name = "man";
  man.x = 25;
  man.y = 70;

  infoPanel.addChild(man);

  manText = new Text("0", style);
  manText.anchor.set(0.5);
  manText.x = 100;
  manText.y = 70;
  manText.name = "manText";
  infoPanel.addChild(manText);

  ///

  info.addChild(infoPanel);
  info.alpha = 0.6;

  const musicButton = new Container();
  musicButton.x = appConstants.size.WIDTH - 100;
  musicButton.y = 100;
  musicButton.name = "musicButton";

  const graphicsMusicOff = new Graphics();
  graphicsMusicOff.lineStyle(2, 0xff00ff, 1);
  graphicsMusicOff.beginFill(0x650a5a, 0.25);
  graphicsMusicOff.drawCircle(15, 15, 30);
  graphicsMusicOff.endFill();
  musicButton.addChild(graphicsMusicOff);

  musicOff = new Sprite(musicOffStatus ? musicOffTexture : musicOnTexture);
  if (musicOffStatus) {
    pause(appConstants.sounds.background)
  } else {
      play(appConstants.sounds.background)
  }

  musicOff.x = -9;
  musicOff.y = -9;
  musicOff.name = "musicOff";
  musicButton.addChild(musicOff);
  musicButton.interactive = true;
  musicButton.on("pointertap", () => {
    musicOffStatus = !musicOffStatus;
    musicOff.texture = musicOffStatus ? musicOffTexture : musicOnTexture;
    if (musicOffStatus) {
      pause(appConstants.sounds.background)
    } else {
        play(appConstants.sounds.background)
    }
  });
  info.addChild(musicButton);

  //effects
  const effectsButton = new Container();
  effectsButton.x = appConstants.size.WIDTH - 100;
  effectsButton.y = 200;
  effectsButton.name = "musicButton";

  const graphicsEffectsOff = new Graphics();
  graphicsEffectsOff.lineStyle(2, 0xff00ff, 1);
  graphicsEffectsOff.beginFill(0x650a5a, 0.25);
  graphicsEffectsOff.drawCircle(15, 15, 30);
  graphicsEffectsOff.endFill();
  effectsButton.addChild(graphicsEffectsOff);

  effectsOff = new Sprite(effectsOffStatus ? effectsOffTexture : effectsOnTexture);
  if (effectsOffStatus) {
    muteEffects()
  } else {
    unMuteEffects()
  }

  effectsOff.x = -9;
  effectsOff.y = -9;
  effectsOff.name = "effectsOff";
  effectsButton.addChild(effectsOff);
  effectsButton.interactive = true;
  effectsButton.on("pointertap", () => {
    effectsOffStatus = !effectsOffStatus;
    effectsOff.texture = effectsOffStatus ? effectsOffTexture : effectsOnTexture
    if (effectsOffStatus) {
        muteEffects()
      } else {
        unMuteEffects()
      }
  });
  info.addChild(effectsButton);

  root.addChild(info)

  return info
};

EventHub.on(appConstants.events.manKilled, (event) => {
    manCount -= 1
    manText.text = `${manCount}`
    if(manCount === 0){
        gameOver()
    }
})

EventHub.on(appConstants.events.ufoDestroyed, (event) => {
    ufoCount += 1
    ufoText.text = `${ufoCount}`
    if(ufoCount === ufoMaxCount){
        youWin()
    }
})

EventHub.on(appConstants.events.resetPeople, (event) => {
    manCount = event.count
    manText.text = `${manCount}`
    ufoCount = 0
    ufoText.text = `${ufoCount}`
    const level = getLevel()
    ufoMaxCount = level.enemyCount * 10
})
