import {IPoint} from "./IPoint";
import {IMonster} from "./IMonster";

export interface IRoom {
    description: string;
    coords: IPoint;
    mapCharacter: string;

    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;
    adjacentRooms: Array<IRoom>;

    isAccessible: boolean;
    inaccessibleReason: string;

    transmitter: boolean;
    monsters: Set<IMonster>;

    exitText: string;
}