import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {Snowflake} from "discord.js";

export class Game {
    overwatchPlayer: Snowflake;
    avatarPlayer: Snowflake;

    avatar: Avatar;
    map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
        this.avatar = new Avatar(this, this.map.getRoom({x: 0, y: 0}));
    }

    isAvatarPlayer(playerId: Snowflake): boolean {
        return this.avatarPlayer == playerId;
    }
}