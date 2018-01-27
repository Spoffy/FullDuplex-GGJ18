import {IRoom} from "../../Interfaces/IRoom";

export class BaseRoom implements IRoom {
    description = "A stretch of empty, metallic corridor."

    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;
}