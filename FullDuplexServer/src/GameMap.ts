import {IRoom} from "./Interfaces/IRoom";
import {EmptyRoom} from "./GameObjects/Rooms/EmptyRoom";
import {IPoint} from "./Interfaces/IPoint";

export class GameMap {
    private mapData: Array<Array<IRoom>>;

    static fromString(serializedMap: string) {
        let map = new GameMap();
        map.mapData = [];

        let line = [];
        for(let char of serializedMap) {
            switch(char) {
                case "\n":
                    map.mapData.push(line);
                    line = [];
                    break;
                case "x":
                    line.push(new EmptyRoom());
                    break;
                default:
                    throw new Error("Oh dear. That's not a valid character in the map.");
            }
        }

        return map;
    }

    getRoom(loc: IPoint) {
        return this.mapData[loc.x][loc.y];
    }
}