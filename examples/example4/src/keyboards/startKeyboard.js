import { Markup } from 'telegraf';
import constants from '../common/constants.js';

export const getStartKeyboard = () => {
    return Markup.keyboard([[
        Markup.button.callback(constants.actions.add, constants.commands.add,),
        Markup.button.callback(constants.actions.find, constants.commands.find),
        Markup.button.callback(constants.actions.remove, constants.commands.remove),
      ],
    ]).oneTime().resize()
}