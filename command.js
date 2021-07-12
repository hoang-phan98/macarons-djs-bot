import { prefix } from "./config.json";

/**
 * Basic command handler
 * @param {*} client - the Discord bot client
 * @param {*} alias - the name of the command
 * @param {*} cb - the callback function that will be executed
 */
const command = (client, alias, cb) => {
    client.on('message', (message) => {
        const { content } = message
        const command = `${prefix}${alias}`

        if (content.startsWith(`${command} `) || content === command) {
            console.log(`Running the command ${command}`)
            cb(message)
        }
    })
}

export default command;