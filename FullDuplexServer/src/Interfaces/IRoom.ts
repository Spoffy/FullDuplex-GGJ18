import {IPoint} from "./IPoint";

export interface IRoom {
    description: string;
    coords: IPoint;

    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;

    isAccessible: boolean;
    inaccessibleReason: string;

    exitText: string;
}