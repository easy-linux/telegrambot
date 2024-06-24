import { Markup } from 'telegraf';
import constants from '../common/constants.js';

export const getExitKeyboard = () => {
    return Markup.keyboard([[
        Markup.button.callback(constants.actions.exit, constants.commands.exit),
      ],
    ]).oneTime().resize()
}