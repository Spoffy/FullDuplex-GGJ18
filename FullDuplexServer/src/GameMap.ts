import {IRoom} from "./Interfaces/IRoom";
import {EmptyRoom} from "./GameObjects/Rooms/EmptyRoom";
import {IPoint} from "./Interfaces/IPoint";
import {DoorRoom} from "./GameObjects/Rooms/DoorRoom";

export class GameMap {
    private mapData: Array<Array<IRoom>>;
    public doors: Array<DoorRoom>;

    private constructor() {};

    static fromString(serializedMap: string) {
        let map = new GameMap();
        map.mapData = [];
        map.doors = [];

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
                case "d":
                    let newRoom = new DoorRoom();
                    line.push(newRoom);
                    map.doors.push(newRoom);
                    break;
                case " ":
                    break;
                default:
                    throw new Error("Oh dear. That's not a valid character in the map.");
            }
        }

        map.connect();
        return map;
    }

    private connect() {
        this.mapData.forEach((line, y) => {
            line.forEach((room, x) => {
                let westRoom = this.getRoom({x: x - 1, y: y});
                let northRoom = this.getRoom({x: x, y: y - 1});
                if(room && westRoom) {
                    westRoom.east = room;
                    room.west = westRoom;
                }
                if(room && northRoom) {
                    northRoom.south = room;
                    room.north = northRoom;
                }
                room.coords = {x: x, y: y};
            })
        });
    }

    getRoom(loc: IPoint): IRoom {
        return this.mapData[loc.y]? this.mapData[loc.y][loc.x] : null;
    }
}