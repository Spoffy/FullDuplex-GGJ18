import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {Snowflake, User, TextChannel, Guild} from "discord.js";

export class Game {
    remotePlayer: {user: User, channel: TextChannel, server: Guild};
    avatarPlayer: {user: User, channel: TextChannel, server: Guild};

    avatar: Avatar;
    map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
        this.avatar = new Avatar(this, this.map.getRoom({x: 0, y: 0}));
    }

    isAvatarPlayer(playerId: Snowflake): boolean {
        return this.avatarPlayer && this.avatarPlayer.user.id == playerId;
    }

    isRemotePlayer(playerId: Snowflake): boolean {
        return this.remotePlayer && this.remotePlayer.user.id == playerId;
    }
}