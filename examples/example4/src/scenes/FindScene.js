import { Markup, Scenes } from 'telegraf';
import appConstants from '../common/constants.js'
import { checkAndLeaveWizard, downloadVideoHandler } from '../services/utils.js';
import constants from '../common/constants.js';
import { findByName, getVideo } from '../services/database.js';
import { getExitKeyboard } from '../keyboards/exitKeyboard.js';
import { getStartKeyboard } from '../keyboards/startKeyboard.js';


export const FindVideoWizard = new Scenes.WizardScene(constants.scenes.FIND_SCENE,
    (ctx) => {
        try {
            ctx.reply('Введите название видео для поиска', getExitKeyboard())
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
                    await ctx.reply(`Получена строка для поиска: ${name}`)

                    findByName(name).then(async (data) => {
                        if (data.length === 0) {
                            await ctx.reply('Видео не найдено')
                        } else if (data.length === 1) {
                            await ctx.reply('Видео найдено. Загрузка...')
                            const currentId = data[0].video_id
                            const currentName = data[0].video_name
                            const currentDescription = data[0].video_desc
                            getVideo(currentId).then(async (data) => {
                                if (Array.isArray(data)) {
                                    ctx.sendChatAction('upload_video')
                                    await ctx.reply(`Найдено единственное видео ${currentName}\t(${currentDescription ? currentDescription : 'No description'})`)
                                    await downloadVideoHandler(ctx, data[0].file_id)
                                    return ctx.scene.leave()
                                }
                            })
                        } else {
                            const msg = await ctx.reply('Найдено несколько видео. Выберите одно. ', Markup.inlineKeyboard(
                                data.map((file) => {
                                    if(!file.video_desc){
                                        return [
                                            Markup.button.callback(`${file.video_name}`, `get_file/${file.video_id}`),
                                            Markup.button.callback(`ℹ️`, `info_file/${file.video_id}`)
                                        ]
                                    } else {
                                        return [
                                            Markup.button.callback(`${file.video_name} - ${file.video_desc}`, `get_file/${file.video_id}`),
                                            Markup.button.callback(`ℹ`, `info_file/${file.video_id}`)
                                        ]
                                    }
                                })
                            ).oneTime());
                        }
                    })
                } else {
                    await ctx.reply('Нужно ввести как минимум 3 буквы')
                }
            } else {
                await ctx.reply('Ошибка в названии видео')
            }
        } catch (e) {
            console.error(JSON.stringify(e))
        }
    },
    (ctx) => {
        return ctx.scene.leave()
    }
)

FindVideoWizard.command(appConstants.commands.exit, (ctx) => {
    ctx.scene.leave()
    return true
})

FindVideoWizard.command(appConstants.commands.start, (ctx) => {
    ctx.scene.leave()
    return startHandler(ctx)
})

FindVideoWizard.action(/get_file\/.+/, async (ctx) => {
    try {
        const videoId = ctx.match[0].replace('get_file/', '')    
        getVideo(videoId).then(async (data) => {
            if (Array.isArray(data) && data.length === 1) {
                ctx.sendChatAction('upload_video')
                await downloadVideoHandler(ctx, data[0].file_id)
                ctx.wizard.next()
            }
        })
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})

FindVideoWizard.action(/info_file\/.+/, async (ctx) => {
    try {
        const videoId = ctx.match[0].replace('info_file/', '')    
        getVideo(videoId).then(async (data) => {
            if (Array.isArray(data) && data.length === 1) {
                const info = data[0]
                ctx.reply(`Имя видео: ${info.video_name}\nОписание видео: ${info.video_desc}`)
            }
        })
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})

FindVideoWizard.leave(async (ctx) => {
    try {
        if (ctx.message?.text === constants.actions.exit || ctx.message?.text === 'exit') {
            await ctx.reply('Поиск прерван', getStartKeyboard())
        } else {
            ctx.reply('Поиск завершен', getStartKeyboard())
        }
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})


