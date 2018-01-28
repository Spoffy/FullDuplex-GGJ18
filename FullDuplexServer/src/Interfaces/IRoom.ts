import {IPoint} from "./IPoint";

export interface IRoom {
    description: string;
    coords: IPoint;
    mapCharacter: string;

    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;

    isAccessible: boolean;
    inaccessibleReason: string;

    transmitter: boolean;

    exitText: string;
}