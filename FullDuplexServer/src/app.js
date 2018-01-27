"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const MessageProcessor_1 = require("./MessageProcessor");
const client = new Discord.Client();
const token = "NDA2NTY2ODIxNDUwNDgxNjg0.DU3XMQ.r9rkbnl8ARmWnGYmXCTP7dtoGv4";
const messageProcessor = new MessageProcessor_1.MessageProcessor();
console.log('Full Duplex Server starting... connecting to Discord.');
client.on("message", (message) => {
    messageProcessor.processMessage(message);
});
client.login(token)
    .then(() => {
    console.log(`Logged in as ${client.user.tag}!`);
})
    .catch((reason) => console.log(`Unable to Login: ${reason}`));
//# sourceMappingURL=app.js.map