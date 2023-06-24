import { AnimatedSprite, Container, Texture } from "pixi.js"
import appConstants from "../common/constants"
import { play } from "../common/sound"
import { randomIntFromInterval, destroySprite } from "../common/utils"


let app
let explosions

const explosionTypes = ['Explosion_Sequence', 'Explosion_Sequence1', 'Explosion_Sequence2', 'Explosion_Sequence3']

const explosionTextures = {}

export const initExplosions = (currApp, root) => {
    explosions = new Container()
    explosions.name = appConstants.containers.explosions
    app = currApp
    root.addChild(explosions)
    return explosions
}

export const addExplosion = (coords) => {
   const idx = randomIntFromInterval(0, explosionTypes.length - 1)
   const explosionType = explosionTypes[idx]
   let textures 
   if(explosionTextures[explosionType]){
    textures = explosionTextures[explosionType]
   } else {
     textures = []
     for(let i = 0; i < 12; i++){
        const texture = Texture.from(`${explosionType} ${i+1}.png`)
        textures.push(texture)
     }
     explosionTextures[explosionType] = textures
   }

   const explosion = new AnimatedSprite(textures)
   explosion.loop = false
   explosion.animationSpeed = 0.2
   explosion.anchor.set(0.5)
   explosion.position.set(coords.x, coords.y)
   explosions.addChild(explosion)
   explosion.onComplete = function (e){
    destroySprite(this)
   }
   explosion.play()
   play(appConstants.sounds.explosion)
}