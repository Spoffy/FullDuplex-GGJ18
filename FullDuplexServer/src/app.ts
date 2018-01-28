import * as Discord from "discord.js";
import {MessageProcessor} from "./MessageProcessor";
import {MemoryDataStore} from "./Storage/MemoryDataStore";
import {Ticker} from "./Ticker";

const client = new Discord.Client({restTimeOffset: 200, apiRequestMethod: 'sequential'});
const token = "NDA2NTY2ODIxNDUwNDgxNjg0.DU3XMQ.r9rkbnl8ARmWnGYmXCTP7dtoGv4";
const dataStore = new MemoryDataStore();
const messageProcessor = new MessageProcessor(dataStore);
const ticker = new Ticker(dataStore);

console.log('Full Duplex Server starting... connecting to Discord.');

client.on("message", (message: Discord.Message) => {
    messageProcessor.processMessage(message);
});

client.login(token)
    .then(() => {
        console.log(`Logged in as ${client.user.tag}!`);
    })
    .catch((reason: string) => console.log(`Unable to Login: ${reason}`));

ticker.begin();