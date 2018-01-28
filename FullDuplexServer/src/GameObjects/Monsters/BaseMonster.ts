import {IMonster} from "../../Interfaces/IMonster";
import {IRoom} from "../../Interfaces/IRoom";

export class BaseMonster implements IMonster {
    room: IRoom;

    tick() {}

}