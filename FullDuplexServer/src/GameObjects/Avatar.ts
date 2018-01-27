import {Game} from "../Game";
import {IRoom} from "../Interfaces/IRoom";
import {Direction} from "../Direction";
import {BaseRoom} from "./Rooms/BaseRoom";

export class Avatar {
    game: Game;
    room: IRoom;

    constructor(game: Game, startRoom: IRoom) {
        this.game = game;
        this.room = startRoom;
    };

    move(dir: Direction): Promise<void> {
        let nextRoom = this.room[dir];

        if(!nextRoom) {
            return Promise.reject(BaseRoom.defaultInaccessibleReason);
        } else if(!nextRoom.isAccessible) {
            return Promise.reject(nextRoom.inaccessibleReason);
        }

        this.room = nextRoom;
        return Promise.resolve();
    }
}