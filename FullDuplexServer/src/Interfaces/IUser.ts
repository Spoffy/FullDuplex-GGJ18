import {User, TextChannel, Guild} from "discord.js";

export interface IUser {
    user: User,
    channel: TextChannel,
    server: Guild
}