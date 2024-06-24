import * as url from 'node:url';
import constants from "../common/constants.js";
import { Input } from 'telegraf'

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export const downloadVideoHandler = async (ctx, fileId) => {
    ctx.reply('Загрузка видео...')
    return ctx.telegram.getFileLink(fileId).then(async(url) => {
        await ctx.replyWithVideo(Input.fromURLStream(url.href))
    })
}

export const checkAndLeaveWizard = (ctx) => {
    if (ctx.message?.text === constants.actions.exit || ctx.message?.text === 'exit') {
        ctx.scene.leave()
        return true
    }
    return false
}