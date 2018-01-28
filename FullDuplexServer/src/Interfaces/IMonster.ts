import {IRoom} from "./IRoom";
import {ITickable} from "./ITickable";

export interface IMonster extends ITickable {
    room: IRoom;
}