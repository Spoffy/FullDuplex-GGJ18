import * as Discord from "discord.js";

export class MessageProcessor {
    public processMessage(message: Discord.Message) {
        if(message.author.id == message.client.user.id) {
            console.log("Not replying: This bot doesn't talk to itself.");
            return;
        }
        console.log(message.author.username, ":", message.content);
        message.channel.send("Bananas!").catch(() => {});
    }
}