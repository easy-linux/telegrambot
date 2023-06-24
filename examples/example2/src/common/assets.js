import {Assets} from 'pixi.js'
import appTextures, { allTextureKeys } from './textures'

Object.entries(appTextures).forEach(([key, value]) => {
    Assets.add(key, value)
})

const textures = new Map()

export const loadAssets = (onProgress) => {
    const keys = Object.entries(allTextureKeys).map(([key, value]) => value)
    Assets.load([...keys], onProgress).then((data) => {
        Object.entries(data).forEach(([key, value]) => {
            textures.set(key, value)
        })
        onProgress('all')
    })
}

export const getTexture = (id) => {
    if(textures.has(id)){
        return textures.get(id)
    }
    return null
}