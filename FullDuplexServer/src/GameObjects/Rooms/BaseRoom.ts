import {IRoom} from "../../Interfaces/IRoom";
import {IPoint} from "../../Interfaces/IPoint";

export class BaseRoom implements IRoom {
    baseDescription = "a stretch of empty corridor, with black and purple tiled walls. They remind you of a debugging texture.";
    coords: IPoint;

    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;

    isAccessible = true;
    static defaultInaccessibleReason = "there's a wall in the way";
    inaccessibleReason = "there's a wall in the way";

    transmitter = false;

    get description(): string {
        return this.baseDescription;
    }

    set description(newDescription: string) {
        this.baseDescription = newDescription;
    }

    get exitText(): string {
        return "There are exits to the:\n"
            + (this.north? `- North: ${this.north.description}\n` : "")
            + (this.east? `- East: ${this.east.description}\n` : "")
            + (this.south? `- South: ${this.south.description}\n` : "")
            + (this.west? `- West: ${this.west.description}\n` : "");
    }
}