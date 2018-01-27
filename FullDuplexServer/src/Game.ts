import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {IRoom} from "./Interfaces/IRoom";
import {Snowflake} from "discord.js";
import {boolToPromise} from "./Helpers/BooleanPromise";

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

    isAvatarPlayer(playerId: Snowflake): boolean {
        return this.avatarPlayer == playerId;
    }
}