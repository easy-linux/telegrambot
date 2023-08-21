export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const checkCollision = (obj1, obj2) => {
  if (obj1 && obj2) {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds2.x < bounds1.x + bounds1.width &&
      bounds2.y < bounds1.y + bounds1.height
    );
  }
  return false;
};

export const destroySprite = (sprite) => {
  sprite.parent.removeChild(sprite);
  sprite.destroy({ children: true });
};

export const getCoordX = (x1, y1, x2, y2, y) => {
  const k = (y2-y1) / (x2-x1)
  return ((y - y1) / k ) + x1;
};

export const getCoordXangle = (x1, y1, angle, y) => { 
  const result = (y1 - y) / Math.tan(angle > 0 ? 1 - angle : Math.abs(angle) - 1) + x1;
  return result
};
