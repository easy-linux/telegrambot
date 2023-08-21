import { Sprite } from "pixi.js";
import { addNode, removeNode, setPosition } from "../common/collisions";
import appConstants from "../common/constants";
import { EventHub, manKilled } from "../common/eventHub";
import { getLevel } from "../common/levels";
import { destroySprite, randomIntFromInterval } from "../common/utils";

export class BaseSprite {
  constructor({ container, sprite, offset, isCentered }) {
    this.startX = sprite.position.x;
    this.startY = sprite.position.y;
    this.container = container;

    this.sprite = sprite;

    this.box = addNode(this.sprite, {
      offset,
      isCentered,
    });

    this.container.addChild(this.sprite);

    this.onTick = this.onTick.bind(this);
    this.onCollision = this.onCollision.bind(this);
    this.onRestartGame = this.onRestartGame.bind(this);

    EventHub.on(appConstants.events.tick, this.onTick);
    EventHub.on(appConstants.events.collision, this.onCollision);
    EventHub.on(appConstants.events.restartGame, this.onRestartGame);
    this.curentLevel = getLevel()
  }

  dispose() {
    EventHub.off(appConstants.events.tick, this.onTick);
    EventHub.off(appConstants.events.collision, this.onCollision);
    EventHub.off(appConstants.events.restartGame, this.onRestartGame);
    removeNode(this.box);
    this.box = null;
    destroySprite(this.sprite);
    this.sprite = null;
    this.startX = null;
    this.startY = null;
    this.container = null;
  }

  onTick() {
    
  }

  onRestartGame() {
    this.dispose();
  }

  onCollision(e) {
    
  }

  get width() {
    return this.sprite.width;
  }

  get height() {
    return this.sprite.height;
  }

  get x() {
    return this.sprite.position.x;
  }

  get y() {
    return this.sprite.position.y;
  }
  set x(value) {
    return this.sprite.position.x = value;
  }

  set y(value) {
    return this.sprite.position.y = value;
  }

  destroyMe() {
    this.dispose();
  }
}
