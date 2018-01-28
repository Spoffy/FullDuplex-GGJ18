import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {Guild, Snowflake, TextChannel, User} from "discord.js";
import {IPoint} from "./Interfaces/IPoint";
import {inSquareRange} from "./Helpers/PointHelpers";

export class Game {
    remotePlayer: {user: User, channel: TextChannel, server: Guild};
    avatarPlayer: {user: User, channel: TextChannel, server: Guild};

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