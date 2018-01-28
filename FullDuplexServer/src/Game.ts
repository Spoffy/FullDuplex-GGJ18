import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {Guild, Snowflake, TextChannel, User} from "discord.js";
import {IPoint} from "./Interfaces/IPoint";
import {inSquareRange, isAdjacent} from "./Helpers/PointHelpers";
import {IUser} from "./Interfaces/IUser";

export class Game {
    remotePlayer: IUser;
    avatarPlayer: IUser;

    avatar: Avatar;
    knownMap: Array<Array<boolean>> = [];
    map: GameMap;

    transmitterPower = 3;

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

    getUser(playerId: Snowflake): IUser {
        if(this.isAvatarPlayer(playerId)) {
            return this.avatarPlayer;
        }
        if(this.isRemotePlayer(playerId)) {
            return this.remotePlayer;
        }
    }

    localMessage(location: IPoint, message: string): boolean {
        if(isAdjacent(location, this.avatar.room.coords)) {
            return this.avatarPlayer.send(message);
        }
        return false;
    }

    revealArea(center: IPoint, radius: number) {
        for(let y = center.y - radius; y <= center.y + radius; y++) {
            for(let x = center.x - radius; x <= center.x + radius; x++) {
                let row = this.knownMap[y] || [];
                row[x] = true;
                this.knownMap[y] = row;
            }
        }
    }

    inRangeOfTransmitter(loc: IPoint): boolean {
        return this.avatar.transmitterRooms.some((room) => {
            return inSquareRange(room.coords, loc, this.transmitterPower);
        })
    }
}