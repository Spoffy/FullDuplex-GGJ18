import {IRoom} from "../../Interfaces/IRoom";
import {IPoint} from "../../Interfaces/IPoint";

export class BaseRoom implements IRoom {
    description = "a stretch of empty corridor, with black and purple tiled walls. They remind you of a debugging texture.";
    coords: IPoint;

    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;

    isAccessible = true;
    static defaultInaccessibleReason = "there's a wall in the way";
    inaccessibleReason = "there's a wall in the way";
}