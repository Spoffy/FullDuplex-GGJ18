import {Game} from "../Game";
import {IRoom} from "../Interfaces/IRoom";
import {Direction} from "../Direction";

export class Avatar {
    game: Game;
    room: IRoom;

    constructor(game: Game, startRoom: IRoom) {
        this.game = game;
        this.room = startRoom;
    };

    move(dir: Direction): Promise<void> {
        return Promise.reject("There's a wall there.");
    }
}