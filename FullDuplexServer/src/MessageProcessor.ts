import * as Discord from "discord.js";

export class MessageProcessor {
    public processMessage(message: Discord.Message) {
        console.log(message.author.username, ":", message.content);
    }
}