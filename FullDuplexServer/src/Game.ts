import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {Guild, Snowflake, TextChannel, User, Message} from "discord.js";
import {IPoint} from "./Interfaces/IPoint";
import {inSquareRange, isAdjacent} from "./Helpers/PointHelpers";
import {IUser} from "./Interfaces/IUser";
import {ITickable} from "./Interfaces/ITickable";
import {IMonster} from "./Interfaces/IMonster";
import {BaseMonster} from "./GameObjects/Monsters/BaseMonster";
import {GameManager} from "./GameManager";

export class Game implements ITickable {
    remotePlayer: IUser;
    avatarPlayer: IUser;

    avatar: Avatar;
    knownMap: Array<Array<boolean>> = [];
    map: GameMap;

    gameManager: GameManager;

    transmitterPower = 3;

    monsters: Array<IMonster> = [];

    constructor(map: GameMap, gameManager: GameManager) {
        this.map = map;
        this.gameManager = gameManager;
        this.avatar = new Avatar(this, this.map.getRoom({x: 0, y: 0}));
        this.spawnMonsters();
    }

    spawnMonsters() {
        this.map.monsterRooms.forEach((room) => {
            this.monsters.push(new BaseMonster(this, room));
        })
    }

    tick() {
        this.monsters.forEach((monster) => {
            monster.tick();
        })
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

    localMessage(location: IPoint, message: string): Promise<Message|Array<Message>> {
        if(isAdjacent(location, this.avatar.room.coords)) {
            return this.avatarPlayer.send(message);
        }
        return Promise.reject("Avatar is not nearby");
    }

    sameRoomMessage(location: IPoint, message: string): Promise<Message|Array<Message>> {
        if(location == this.avatar.room.coords) {
            return this.avatarPlayer.send(message);
        }
        return Promise.reject("Avatar is not in the same square.");
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

    exitReached() {
        this.avatarPlayer.send("Congratulations, you reached the exit and escaped. Stay tuned for more levels," +
            " or try the game from the other perspective!");
        this.remotePlayer.send("Congratulations, you reached the exit and escaped. Stay tuned for more levels," +
            " or try the game from the other perspective!");
    }

    playerDeath() {
        this.avatarPlayer.send("Yeah.... you died. Gruesomely, with only your overseer for company. What a waste.");
        this.remotePlayer.send("The wanderer died in the maze... you didn't save them.");
        this.gameManager.endGame(this);
    }
}