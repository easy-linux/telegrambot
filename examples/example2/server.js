import { fastify } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import url from "node:url";
import fastifyExpress from "@fastify/express";
import { initBot } from "./src/tgbot.js";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const app = fastify()

app.register(fastifyStatic, {
    root: path.join(__dirname, 'build')
})

await app.register(fastifyExpress)
const serverPort = 3000

initBot(app)

app.listen({port: serverPort}).then(() => {
    console.log('listening on port', serverPort)
})