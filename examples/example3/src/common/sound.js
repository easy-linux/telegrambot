import { Howl } from "howler"
import appConstants from "./constants"

const allSounds = {}

let muteEffectsStatus = true

const effects = [
    appConstants.sounds.shot,
    appConstants.sounds.miss,
    appConstants.sounds.explosion,
    appConstants.sounds.gameOver,
    appConstants.sounds.youWin,
]

allSounds[appConstants.sounds.shot] = new Howl({
    src: ['assets/sounds/shot.mp3'],
    volume: 0.5,
})
allSounds[appConstants.sounds.miss] = new Howl({
    src: ['assets/sounds/miss.mp3'],
    volume: 0.5,
})
allSounds[appConstants.sounds.explosion] = new Howl({
    src: ['assets/sounds/explosion.mp3'],
    volume: 0.5,
})
allSounds[appConstants.sounds.gameOver] = new Howl({
    src: ['assets/sounds/game_over.mp3'],
    volume: 1,
})
allSounds[appConstants.sounds.youWin] = new Howl({
    src: ['assets/sounds/you_win.mp3'],
    volume: 0.5,
})
allSounds[appConstants.sounds.background] = new Howl({
    src: ['assets/sounds/background.mp3'],
    volume: 0.3,
    loop: true,
    autoplay: false,
})


export const playBackground = () => {
    allSounds[appConstants.sounds.background].play()
}

export const play = (id) => { 
    if(muteEffectsStatus){
        if(effects.indexOf(id) === -1){
            allSounds[id].play()
        } 
    } else {
        allSounds[id].play()
    }
}

export const pause = (id) => {
    allSounds[id].pause()
} 

export const resume = (id) => {
    allSounds[id].resume()
} 

export const stop = (id) => {
    allSounds[id].stop()
} 

export const muteAll = () => {
    Howler.mute()
}

export const unmuteAll = () => {
    Howler.mute(false)
}

export const muteEffects = () => {
    muteEffectsStatus = true
}

export const unMuteEffects = () => {
    muteEffectsStatus = false
}
