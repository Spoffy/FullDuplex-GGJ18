import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";
import {IRoom} from "./Interfaces/IRoom";

export class Game {
    public avatar = new Avatar(this);
    public map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
    }

    getAvatarRoom(): IRoom {
        return this.map.getRoom(this.avatar.location);
    }
}