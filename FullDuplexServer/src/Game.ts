import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {IRoom} from "./Interfaces/IRoom";
import {Snowflake} from "discord.js";

export class Game {
    overwatchPlayer: Snowflake;
    avatarPlayer: Snowflake;

    avatar = new Avatar(this);
    map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
    }

    getAvatarRoom(): IRoom {
        return this.map.getRoom(this.avatar.location);
    }
}