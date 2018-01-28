import {IRoom} from "../../Interfaces/IRoom";
import {IPoint} from "../../Interfaces/IPoint";
import {stripNewlines} from "../../Helpers/TextHelpers";

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
        return this.baseDescription + this.transmitterText;
    }

    set description(newDescription: string) {
        this.baseDescription = newDescription;
    }

    get transmitterText(): string {
        return this.transmitter? "\n\nA small transmitter is mounted to the wall here." : "";
    }

    get exitText(): string {
        return "There are exits to the:\n\n"
            + (this.north? `**North**:  \`${stripNewlines(this.north.description)}\`\n` : "")
            + (this.east? `**East**:  \`${stripNewlines(this.east.description)}\n\`` : "")
            + (this.south? `**South**:  \`${stripNewlines(this.south.description)}\`\n` : "")
            + (this.west? `**West**:  \`${stripNewlines(this.west.description)}\`\n` : "");
    }
}