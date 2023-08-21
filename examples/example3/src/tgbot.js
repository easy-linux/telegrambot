import path from "node:path";
import url, { URLSearchParams } from "node:url";
import { Telegraf, Markup } from "telegraf";
import * as dotenv from 'dotenv'
import appRoutes from "./common/routes.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

const gameShortName = process.env.GAME_NAME
const appUrl = `https://${process.env.DOMAIN}`
const webhookDomain = process.env.DOMAIN

export const initBot = (app) => {
    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.use(Telegraf.log())
    const pathUrl = bot.secretPathComponent()
    bot.telegram.setWebhook(`${appUrl}/${pathUrl}`)
    app.use(bot.webhookCallback(`/${pathUrl}`))

    app.post(appRoutes.score, async(req, res) => {
      const {score, game, userData, url} = req.body 
      const urlObj = new URL(url)
      const allData = new URLSearchParams(urlObj.search)
      const userId = allData.get("user_id")
      const id = allData.get("id")
      const messageId = allData.get("message_id")
      const chatId = allData.get("chat_id")
      try{
        const result = await bot.telegram.setGameScore(userId, score, undefined, chatId, messageId)
        res.send(result)
        return
      } catch(e){
        console.log('error score saving', e)
      }
      res.send('ok')
    })

    bot.start(ctx => ctx.replyWithGame(gameShortName))

    bot.gameQuery(ctx => {
        const query = ctx?.update.callback_query
        const user_id = query.from.id
        const id = query.id
        const message_id = query.message.message_id
        const chat_id = query.message.chat.id
        return ctx.answerGameQuery(`${appUrl}?user_id=${user_id}&id=${id}&message_id=${message_id}&chat_id=${chat_id}`)
    })
}