import { utils } from 'pixi.js'
import appConstants from './constants'


export const EventHub = new utils.EventEmitter()

export const infoUpdated = (data) => {
    EventHub.emit(appConstants.events.infoUpdated, data)
}

export const ufoDestroyed = (data) => {
    EventHub.emit(appConstants.events.ufoDestroyed, data)
}
export const manKilled = (data) => {
    EventHub.emit(appConstants.events.manKilled, data)
}
export const bombDestroyed = (data) => {
    EventHub.emit(appConstants.events.bombDestroyed, data)
}
export const youWin = (data) => {
    EventHub.emit(appConstants.events.youWin, data)
}
export const gameOver = (data) => {
    EventHub.emit(appConstants.events.gameOver, data)
}
export const restartGame = (data) => {
    EventHub.emit(appConstants.events.restartGame, data)
}
export const resetPeople = (data) => {
    EventHub.emit(appConstants.events.resetPeople, data)
}
