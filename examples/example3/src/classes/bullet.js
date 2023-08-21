import { AnimatedSprite, ColorMatrixFilter } from "pixi.js";
import { setPosition } from "../common/collisions";
import appConstants from "../common/constants";
import { play } from "../common/sound";
import { addExplosion } from "../sprites/explosions";
import { BaseSprite } from "./baseSprite";

const bulletSpeed = 3;

export class Bullet extends BaseSprite {

  constructor({ container, x, y, textures }) {
    const bullet = new AnimatedSprite(textures);
    const filter = new ColorMatrixFilter();
    bullet.loop = false;
    const { matrix } = filter;
    matrix[1] = Math.sin(Math.random() * 10);
    matrix[2] = Math.cos(Math.random() * 10);
    matrix[3] = Math.cos(Math.random() * 10);
    matrix[4] = Math.sin(Math.random() * 10);
    matrix[5] = Math.sin(Math.random() * 10);
    matrix[6] = Math.sin(Math.random() * 10);
    bullet.filters = [filter];
    bullet.animationSpeed = 0.2;
    bullet.anchor.set(0.5);
    bullet.position.set(x, y - 50);
    bullet.spriteType = appConstants.spriteType.bullet;

    super({
      container,
      sprite: bullet,
      isCentered: true,
    });

    this.sprite.play();
    play(appConstants.sounds.shot);
  }

  dispose() {
    super.dispose();
  }

  onTick() {
    this.y -= this.curentLevel.bulletSpeed;
    setPosition(this.box, { x: this.x, y: this.y });
    if (this.y < 0) {
      this.dispose();
    }
  }

  onRestartGame() {
    this.dispose();
  }

  onCollision(e) {
    const { a, b } = e;
    if (a.sprite === this.sprite || b.sprite === this.sprite) {
      if (a.sprite.spriteType === appConstants.spriteType.bomb || b.sprite.spriteType === appConstants.spriteType.bomb) {
        this.dispose();
      } else if (a.sprite.spriteType === appConstants.spriteType.enemy || b.sprite.spriteType === appConstants.spriteType.enemy) {
        // people destroy
        this.destroyMe();
      }
    }
  }

  destroyMe() {
    addExplosion({ x: this.x, y: this.y - 20 });
    this.dispose();
  }
}
