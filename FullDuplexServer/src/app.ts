import * as Discord from "discord.js";
import {MessageProcessor} from "./MessageProcessor";
import {MemoryDataStore} from "./Storage/MemoryDataStore";

const client = new Discord.Client();
const token = "NDA2NTY2ODIxNDUwNDgxNjg0.DU3XMQ.r9rkbnl8ARmWnGYmXCTP7dtoGv4";
const dataStore = new MemoryDataStore();
const messageProcessor = new MessageProcessor(dataStore);

console.log('Full Duplex Server starting... connecting to Discord.');

client.on("message", (message: Discord.Message) => {
    messageProcessor.processMessage(message);
});

client.login(token)
    .then(() => {
        console.log(`Logged in as ${client.user.tag}!`);
    })
    .catch((reason: string) => console.log(`Unable to Login: ${reason}`));