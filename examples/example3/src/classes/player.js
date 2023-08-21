import { Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import { setPosition } from "../common/collisions";
import appConstants from "../common/constants";
import { play } from "../common/sound";
import { allTextureKeys } from "../common/textures";
import { addBullet } from "../sprites/bullets";
import { BaseSprite } from "./baseSprite";

export class Player extends BaseSprite {
  #lockedState;
  #shotTimeout;

  constructor({ container, x, y, app }) {
    const player = new Sprite(getTexture(allTextureKeys.spaceShip));
    player.name = appConstants.containers.player;
    player.anchor.set(0.5);
    player.position.x = x;
    player.position.y = y;
    player.spriteType = appConstants.spriteType.player;

    super({
      container,
      sprite: player,
      isCentered: true,
    });

    this.app = app;
    this.#lockedState = false;
    this.#shotTimeout = false;
  }

  dispose() {
    super.dispose();
  }

  onTick() {
    if (this.#lockedState) {
      this.sprite.alpha = 0.5;
    } else {
      this.sprite.alpha = 1;
    }

    const playerPosition = this.x;

    this.x = this.app.gameState.mousePosition;

    if (this.x < playerPosition) {
      this.sprite.rotation = -0.3;
    } else if (this.x > playerPosition) {
      this.sprite.rotation = 0.3;
    } else {
      this.sprite.rotation = 0;
    }
  }

  get x() {
    return super.x;
  }

  set x(value) {
    super.x = value;
    setPosition(this.box, { x: value, y: this.y });
  }

  onRestartGame() {
    this.dispose();
  }

  onCollision(e) {
    const { a, b } = e;
    if (a.sprite === this.sprite || b.sprite === this.sprite) {
      if (a.sprite.spriteType == appConstants.spriteType.bomb || b.sprite.spriteType == appConstants.spriteType.bomb) {
        //
      }
    }
  }
  shoot() {
    if (!this.#lockedState) {
      if (this.#shotTimeout) {
        //  play(appConstants.sounds.miss);

        return;
      } else {
        addBullet({ x: this.x, y: this.y });
        play(appConstants.sounds.shot);
        this.#shotTimeout = setTimeout(() => {
          this.#shotTimeout = false;
        }, this.curentLevel.shotPause);
      }
    }
  }

  lockPlayer() {
    if (!this.#lockedState) {
      this.#lockedState = setTimeout(() => {
        this.#lockedState = null;
      }, this.curentLevel.playerLockTime);
    }
  }

  get locked() {
    return this.#lockedState;
  }

  destroyMe() {}
}
