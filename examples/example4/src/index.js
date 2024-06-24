import { Telegraf, session, Scenes } from 'telegraf';
import * as dotenv from 'dotenv'
import path from 'node:path'
import * as url from 'node:url';
import { downloadVideoHandler } from './services/utils.js';
import constants from './common/constants.js';
import { UploadVideoWizard, FindVideoWizard, RemoveVideoWizard } from './scenes/index.js';
import { closeDatabase } from './services/database.js'
import { getStartKeyboard, getExitKeyboard } from './keyboards/index.js';

export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const bot = new Telegraf(process.env.BOT_TOKEN)


//bot.use(Telegraf.log());

const stage = new Scenes.Stage([UploadVideoWizard, FindVideoWizard, RemoveVideoWizard])

bot.use(session())
bot.use(stage.middleware())

export const startHandler = async (ctx) => {
  return ctx.reply('Используйте кнопки для выбора режима',
    getStartKeyboard()
  )
}

bot.start(startHandler)

bot.help(ctx => {
  try {
    ctx.reply(`Поддерживаемые комманды:
      /start   - начать работу
      /add     - добавить новое видео
      /find    - найти добавленное видео
      /remove  - удалить добавленное видео
      /exit    - завершить текущий процесс
    `)
  } catch (e) {
    console.error(JSON.stringify(e))
  }
})


const startUploading = async (ctx) => {
  try {
    await ctx.reply('Добавление видео.', getExitKeyboard())
    ctx.scene.enter(constants.scenes.UPLOAD_VIDEO_SCENE)
  } catch (e) {
    console.error(JSON.stringify(e))
  }
}

const startSearching = async (ctx) => {
  try {
    await ctx.reply('Поиск видео', getExitKeyboard())
    return ctx.scene.enter(constants.scenes.FIND_SCENE)
  } catch (e) {
    console.error(JSON.stringify(e))
  }
}

const startRemoving = async (ctx) => {
  try {
    await ctx.reply('Удаление видео', getExitKeyboard())
      return ctx.scene.enter(constants.scenes.REMOVE_SCENE)
  } catch (e) {
    console.error(JSON.stringify(e))
  }
}

const startExit = async (ctx) => {
  try{
    ctx.scene.leave()
  } catch(e) {
    console.error(JSON.stringify(e))
  }
}

bot.command(constants.commands.add, startUploading)
bot.command(constants.commands.find, startSearching)
bot.command(constants.commands.remove, startRemoving)

bot.action(constants.commands.add, startUploading)
bot.action(constants.commands.find, startSearching)
bot.action(constants.commands.remove, startRemoving)
bot.action(constants.commands.exit, startExit)

bot.hears(constants.actions.add, startUploading)
bot.hears(constants.actions.find, startSearching)
bot.hears(constants.actions.remove, startRemoving)

bot.action(/get_file\/.+/, (ctx) => {
  const videoId = ctx.match[0].replace('get_file/', '')
  getVideo(videoId).then((data) => {
    downloadVideoHandler(ctx, data[0].file_id)
  })
})


bot.catch((err, ctx) => {
  console.error(`cauth error`, JSON.stringify(err))
  console.error(`error context`, ctx)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => {
  closeDatabase()
  bot.stop('SIGINT')
});
process.once('SIGTERM', () => {
  closeDatabase()
  bot.stop('SIGTERM')
});
