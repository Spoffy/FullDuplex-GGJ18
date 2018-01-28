import {Game} from "../Game";
import {IRoom} from "../Interfaces/IRoom";
import {Direction} from "../Direction";
import {BaseRoom} from "./Rooms/BaseRoom";
import {removeItemFromArray} from "../Helpers/ArrayHelpers";

export class Avatar {
    game: Game;
    room: IRoom;

    transmitterCount: number = 1;
    transmitterRooms: Array<IRoom> = [];

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

    toggleTransmitter(): Promise<string> {
        if(this.room.transmitter) {
            if(this.getTransmitter()) {
                return Promise.resolve("get");
            } else {
                return Promise.reject("get");
            }
        }

        if(!this.room.transmitter) {
            if(this.placeTransmitter()) {
                return Promise.resolve("set");
            } else {
                return Promise.reject("set");
            }
        }

        throw new Error("Error in toggle transmitter. Should never occur, all code paths should be covered.");
    }

    placeTransmitter() {
        if (this.transmitterCount <= 0 || this.room.transmitter) {return false;}

        this.room.transmitter = true;
        this.transmitterRooms.push(this.room);
        this.transmitterCount -= 1;

        this.game.revealArea(this.room.coords, this.game.transmitterPower);
        return true;
    }

    getTransmitter(): boolean {
        if(!this.room.transmitter) {return false;}

        this.room.transmitter = false;
        removeItemFromArray(this.room, this.transmitterRooms);
        this.transmitterCount += 1;
        return true;
    }
}