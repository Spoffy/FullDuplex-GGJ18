import {User, TextChannel, Guild, Message} from "discord.js";

export interface IUser {
    user: User,
    channel: TextChannel,
    server: Guild

    send: (message: string) => Promise<Message|Array<Message>>;
}