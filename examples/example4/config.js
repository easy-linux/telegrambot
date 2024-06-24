import path from 'node:path'
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
    databasePath: path.join(__dirname, './database/bot.db'),
}


