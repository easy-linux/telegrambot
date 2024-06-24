import { Markup, Scenes } from 'telegraf';
import appConstants from '../common/constants.js'
import constants from '../common/constants.js';
import { findByName, deleteVideo, getVideo } from '../services/database.js';
import { getExitKeyboard } from '../keyboards/exitKeyboard.js';
import { getStartKeyboard } from '../keyboards/startKeyboard.js';
import { checkAndLeaveWizard } from '../services/utils.js';

export const RemoveVideoWizard = new Scenes.WizardScene(constants.scenes.REMOVE_SCENE,
    (ctx) => {
        try {
            ctx.reply('Введите имя для поиска.', getExitKeyboard())
            return ctx.wizard.next()
        } catch (e) {
            console.error(JSON.stringify(e))
        }
    },
    async (ctx) => {
        try {
            if (checkAndLeaveWizard(ctx)) {
                return
            }
            if (ctx.message?.text) {
                if (ctx.message?.text.length >= 3) {
                    const name = ctx.message.text
                    ctx.reply(`Получена строка для поиска: ${name}`)

                    findByName(name).then(async (data) => {
                        if (data.length === 0) {
                            ctx.reply('Видео не найдено')
                        } else {
                            const msg = await ctx.reply('Найдено видео', Markup.inlineKeyboard(
                                data.map((file) => {
                                    return [Markup.button.callback(`Удалить видео "${file.video_name}"?`, `remove_file/${file.video_id}`)]
                                })
                            ).oneTime().resize());
                        }
                    })
                } else {
                    ctx.reply('Нужно ввести как минимум 3 буквы')
                }
            } else {
                ctx.reply('Ошибочная поисковая строка')
            }
        } catch (e) {
            console.error(JSON.stringify(e))
        }
    },
    (ctx) => {
        return ctx.scene.leave()
    }
)

RemoveVideoWizard.action(/remove_file\/.+/, async (ctx) => {
    try {
        const videoId = ctx.match[0].replace('remove_file/', '')
        try {
            await deleteVideo(videoId)
            ctx.scene.leave()
        } catch (e) {
            console.error(JSON.stringify(e))
        }
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})

RemoveVideoWizard.command(appConstants.commands.exit, (ctx) => {
    ctx.scene.leave()
    return true
})

RemoveVideoWizard.command(appConstants.commands.start, (ctx) => {
    ctx.scene.leave()
    return startHandler(ctx)
})


RemoveVideoWizard.leave(async (ctx) => {
    try {
        if (ctx.message?.text === constants.actions.exit || ctx.message?.text === 'exit') {
            await ctx.reply('Удаление было прервано', getStartKeyboard())
        } else {
            ctx.reply('Удаление завершено', getStartKeyboard())
        }
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})


