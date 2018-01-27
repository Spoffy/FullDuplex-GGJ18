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

    get description(): string {
        return this.baseDescription + "\n"
            + this.exitText();
    }

    set description(newDescription: string) {
        this.baseDescription = newDescription;
    }

    protected exitText(): string {
        return "There are exits to the:\n"
            + (this.north? "- North\n" : "")
            + (this.east? "- East\n" : "")
            + (this.south? "- South\n" : "")
            + (this.west? "- West\n" : "");
    }
}