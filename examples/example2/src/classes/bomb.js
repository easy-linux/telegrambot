import { Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import { setPosition } from "../common/collisions";
import appConstants from "../common/constants";
import { allTextureKeys } from "../common/textures";
import { getCoordX } from "../common/utils";
import { addExplosion } from "../sprites/explosions";
import { getPlayer } from "../sprites/player";
import { BaseSprite } from "./baseSprite";

export class Bomb extends BaseSprite {
  constructor({ container, x, y, target }) {
    const bomb = new Sprite(getTexture(allTextureKeys.bomb));
    bomb.anchor.set(0.5);
    bomb.alive = true;
    bomb.position.x = x;
    bomb.position.y = y;
    bomb.spriteType = appConstants.spriteType.bomb;

    super({
      container,
      sprite: bomb,
      isCentered: true,
    });
    if (target) { 
      const angle = Math.atan((target.y - this.y) / (target.x - this.x));
      if(angle < 0){
        this.sprite.rotation = angle + Math.PI/2
      } else if(angle > 0){
        this.sprite.rotation = angle - Math.PI/2
      }
      
    }
    this.target = target;
    
  }

  dispose() {
    super.dispose();
    this.target = null;
  }

  onTick() {
    const currX = this.x;
    const currY = this.y;
    this.y += this.curentLevel.bombSpeed;

    let newX = currX;
    if (this.target) {
      newX = getCoordX(currX, currY, this.target.x, this.target.y, this.y);
    }

    this.x = newX;
    setPosition(this.box, { x: this.x, y: this.y });
    if (this.y > appConstants.size.HEIGHT || this.x < 0 || this.x > appConstants.size.WIDTH) {
      this.dispose();
    }
  }

  onRestartGame() {
    this.dispose();
  }

  onCollision(e) {
    const { a, b } = e;
    if (a.sprite === this.sprite || b.sprite === this.sprite) {
      if (a.sprite.spriteType === appConstants.spriteType.player || b.sprite.spriteType === appConstants.spriteType.player) {
        const player = getPlayer();
        if (!player.locked) {
          player.lockPlayer();
          this.destroyMe();
        }
      } else if (a.sprite.spriteType === appConstants.spriteType.man || b.sprite.spriteType === appConstants.spriteType.man) {
        // collision with man
        this.destroyMe();
      } else if (a.sprite.spriteType === appConstants.spriteType.bullet || b.sprite.spriteType === appConstants.spriteType.bullet) {
        // collision with bullet
        this.destroyMe();
      }
    }
  }

  destroyMe() {
    addExplosion({ x: this.x, y: this.y + 20 });
    this.dispose();
  }
}
