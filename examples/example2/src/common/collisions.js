import { System, Box } from "detect-collisions";

const system = new System();

export const addNode = (sprite, { offset, ...rest } = {}) => {
  const box = new Box(
    {
      x: sprite.position.x,
      y: sprite.position.y,
    },
    sprite.width,
    sprite.height,
    {
      ...rest,
    }
  );
  if (offset) {
    box.setOffset(offset);
  }
  box.sprite = sprite;
  system.insert(box);
  return box;
};

export const removeNode = (node) => {
  system.remove(node);
};

export const setPosition = (node, { x, y }) => {
  node.setPosition(x, y);
};

export const checkCollisions = (callback) => {
  system.checkAll((response) => {
    callback(response.a, response.b);
  });
};