import {Avatar} from "./GameObjects/Avatar";
import {GameMap} from "./GameMap";

export class Game {
    public avatar = new Avatar();
    public map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
    }
}