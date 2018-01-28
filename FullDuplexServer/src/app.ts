import {MessageProcessor} from "./MessageProcessor";
import {MemoryDataStore} from "./Storage/MemoryDataStore";
import {Ticker} from "./Ticker";
import {Message, Snowflake, Client, User} from "discord.js";

const client = new Client({restWsBridgeTimeout: 5000, restTimeOffset: 300, apiRequestMethod: 'sequential'});
const token = "NDA2NTY2ODIxNDUwNDgxNjg0.DU3XMQ.r9rkbnl8ARmWnGYmXCTP7dtoGv4";
const dataStore = new MemoryDataStore();
const messageProcessor = new MessageProcessor(dataStore);
const ticker = new Ticker(dataStore);

console.log('Full Duplex Server starting... connecting to Discord.');

client.on("message", (message: Message) => {
    try {
        messageProcessor.processMessage(message);
    } catch(e) {
        console.error(e);
        Object.keys(dataStore.playerGames).forEach((playerId: Snowflake) => {
            client.fetchUser(playerId).then((user: User) => {
                user.send("The server has encountered an exception and needs to be restarted. Apologies for the inconvinience",
                          {reply: user});
            })
        })
    }
});

client.login(token)
    .then(() => {
        console.log(`Logged in as ${client.user.tag}!`);
    })
    .catch((reason: string) => console.log(`Unable to Login: ${reason}`));

ticker.begin();