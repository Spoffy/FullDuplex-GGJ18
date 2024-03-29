import {IUser} from "./Interfaces/IUser";
import {User, TextChannel, Guild, Message} from "discord.js";

export class GameUser implements IUser {
    user;
    channel;
    server;

    constructor(user: User, channel: TextChannel, server: Guild) {
        this.user = user;
        this.channel = channel;
        this.server = server;
    }

    send(message: string): Promise<Message|Array<Message>> {
        return this.channel.send(message, {reply: this.user});
    }

    static reply(originalMessage: Message, messageToSend: string): boolean {
        originalMessage.reply(messageToSend).catch(console.error);
        return true;
    }
}