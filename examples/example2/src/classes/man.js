import { Sprite } from "pixi.js";
import { setPosition } from "../common/collisions";
import appConstants from "../common/constants";
import { manKilled } from "../common/eventHub";
import { randomIntFromInterval } from "../common/utils";
import { recalculateAlivePeople } from "../sprites/people";
import { BaseSprite } from "./baseSprite";

export class Man extends BaseSprite {
  constructor({ container, x, y, index, peopleFrames, tombStoneFrames }) {
    const man = new Sprite(peopleFrames[randomIntFromInterval(0, peopleFrames.length - 1)]);
    man.anchor.set(0.5, 1);
    man.name = index;
    man.alive = true;
    man.position.x = x;
    man.position.y = y;
    man.spriteType = appConstants.spriteType.man;

    super({
      container,
      sprite: man,
      offset: {
        x: -man.width / 2,
        y: -man.height,
      },
    });

    this.peopleFrames = peopleFrames;
    this.tombStoneFrames = tombStoneFrames;
  }

  dispose() {
    super.dispose();
    this.peopleFrames = null;
    this.tombStoneFrames = null;
  }

  onTick() {
    if (this.y > this.startY) {
      this.y -= 1;
      setPosition(this.box, { x: this.startX, y: this.y });
    }
  }

  onRestartGame() {
    this.dispose();
  }

  onCollision(e) {
    const { a, b } = e;
    if (a.sprite === this.sprite || b.sprite === this.sprite) {
      this.destroyMe();
    }
  }

  destroyMe() {
    if (this.sprite.alive) {
      this.sprite.alive = false;
      manKilled();
      this.sprite.texture = this.tombStoneFrames[randomIntFromInterval(0, this.tombStoneFrames.length - 1)];
      this.sprite.position.y = this.startY + 100;
      setPosition(this.box, { x: this.startX, y: this.startY + 100 });
      recalculateAlivePeople()
    } else {
      this.dispose();
    }
  }
}
