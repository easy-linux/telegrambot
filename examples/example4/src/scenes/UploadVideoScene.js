import { Markup, Scenes } from 'telegraf';
import * as dotenv from 'dotenv'
import constants from '../common/constants.js';
import { deleteVideo, getByName, insertVideo } from '../services/database.js'

import { getExitKeyboard } from '../keyboards/exitKeyboard.js';
import { getStartKeyboard } from '../keyboards/startKeyboard.js';
import appConstants from '../common/constants.js'
import { checkAndLeaveWizard } from '../services/utils.js';

dotenv.config()

const saveVideoData = (ctx) => {
    insertVideo(
        ctx.wizard.state.addData.videoName, 
        ctx.wizard.state.addData.description, 
        ctx.wizard.state.addData.fileId)
        .then(() => {
            ctx.reply(`Сохранено успешно.\nВыберите режим работы`, getStartKeyboard())
            return ctx.scene.leave()
        })
        .catch(() => {
            ctx.reply('Ошибка при сохранении файла')
        })
}

export const UploadVideoWizard = new Scenes.WizardScene(constants.scenes.UPLOAD_VIDEO_SCENE,
    async (ctx) => {
        ctx.reply('Введите название видео.', getExitKeyboard())
        ctx.wizard.state.addData = {}
        return ctx.wizard.next()
    },
    async (ctx) => {
        try {           
            if (checkAndLeaveWizard(ctx)) {
                return
            }
            if (ctx.message?.text) {
                const videoName = ctx.message.text
                await ctx.reply(`Назание видео: ${videoName}`)

                    ctx.wizard.state.addData.videoName = videoName

                    const hasThisName = await getByName(videoName)
                    if (Array.isArray(hasThisName) && hasThisName.length > 0) {
                        ctx.wizard.state.addData.confirmation = true
                        ctx.wizard.state.videoId = hasThisName[0].video_id

                        await ctx.reply('Видео с таким именем уже есть. Удалить?', {
                            ...Markup.inlineKeyboard([
                                Markup.button.callback('Да', `confirm/Yes`),
                                Markup.button.callback('Нет', `confirm/No`),
                            ]).oneTime().resize(),
                        });
                        return;
                    } else {
                        ctx.wizard.state.addData.confirmation = false
                        await ctx.reply('Загрузите видео.', getExitKeyboard())
                        return ctx.wizard.next()
                    }
            }else {
                await ctx.reply('Ошибка в имени видео', getExitKeyboard())
            }
        } catch (e) {
            console.error('error', JSON.stringify(e))
        }
    },
    async (ctx) => {
        try {
            if (checkAndLeaveWizard(ctx)) {
                return
            }

            if (ctx.message?.video || (ctx.message?.document && (ctx.message?.document?.mime_type === 'video/mp4' || ctx.message?.document?.mime_type === 'video/quicktime'))) {
                ctx.sendChatAction('upload_video')
                const video = ctx.message.video || ctx.message.document
                ctx.wizard.state.addData.fileId = video.file_id
                ctx.wizard.state.addData.confirmDesk = 'ask'
                await ctx.reply('Введите описание', {
                    ...Markup.inlineKeyboard([
                        Markup.button.callback('Да', `description/Yes`),
                        Markup.button.callback('Нет', `description/No`),
                    ]).oneTime().resize(),
                });

                return ctx.wizard.next()
            } else {
                await ctx.reply('Подедрживается только видео')
                await ctx.reply('Выберете видео. ')
            }
        } catch (e) {
            console.error(JSON.stringify(e))
        }
    },
    async (ctx) => {
        try {
            if (checkAndLeaveWizard(ctx)) {
                return
            }
            if (ctx.wizard.state.addData.confirmDesk === 'ask') {
                ctx.deleteMessage()
                console.log('Добавление описания')
                if (ctx.message?.text) {
                    console.log(`description = ${ctx.message.text}` )
                    ctx.wizard.state.addData.description = ctx.message.text;
                    ctx.wizard.state.addData.confirmDesk = ''
                } else {
                    ctx.reply('Введите описание');
                    return;
                }
            }

            saveVideoData(ctx);
            return ctx.scene.leave();
        } catch (e) {
            console.error(JSON.stringify(e))
        }
    }
)

UploadVideoWizard.leave(async (ctx) => {
    try {
        if (ctx.message?.text === constants.actions.exit || ctx.message?.text === 'exit') {
            await ctx.reply('Добавление видео прервано', getStartKeyboard())
        } else {
            await ctx.reply('Добавление видео завершено', getStartKeyboard())
        }
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})

UploadVideoWizard.command(appConstants.commands.exit, (ctx) => {
    ctx.scene.leave()
    return true
})

UploadVideoWizard.command(appConstants.commands.start, (ctx) => {
    ctx.scene.leave()
    return startHandler(ctx)
})

UploadVideoWizard.action(/confirm\/.+/, async (ctx) => {
    try {
        const answer = ctx.match[0].replace('confirm/', '')
        if (answer === 'Yes') {
            await deleteVideo(ctx.wizard.state.videoId)
            ctx.deleteMessage()
            ctx.wizard.state.addData.confirmation = false
            await ctx.reply('Видео успешно удалено')
            await ctx.reply('Загрузите видео.', getExitKeyboard())
            return ctx.wizard.next()
        } else {
            // no
            ctx.wizard.state.addData.confirmation = false
            return ctx.scene.leave()
        }
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})

UploadVideoWizard.action(/description\/.+/, async (ctx) => {
    try {
        const answer = ctx.match[0].replace('description/', '')
        if (answer === 'Yes') {
            // нужно ввести описание
            ctx.wizard.state.addData.confirmDesk = 'ask'
            return await ctx.reply('Введите описание')
        } else {
            // описание не нужно
            ctx.wizard.state.addData.confirmDesk = ''
            ctx.wizard.state.addData.description = ''
            return await ctx.reply('Продолжаем без описания')
        }
    } catch (e) {
        console.error(JSON.stringify(e))
    }
})


