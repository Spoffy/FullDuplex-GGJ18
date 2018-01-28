import {MemoryDataStore} from "./Storage/MemoryDataStore";
import {ITickable} from "./Interfaces/ITickable";
import Timer = NodeJS.Timer;
import {GameManager} from "./GameManager";
import {Game} from "./Game";

export class Ticker implements ITickable {
    dataStore: MemoryDataStore;
    gameManager: GameManager;
    timer: Timer;
    tickRate: number;

    constructor(dataStore: MemoryDataStore, tickRate: number = 1000) {
        this.dataStore = dataStore;
        this.gameManager = new GameManager(this.dataStore);
        this.tickRate = tickRate;
    }

    begin() {
        this.timer = global.setInterval(this.tick.bind(this), this.tickRate);
    }

    tick() {
        this.gameManager.games.forEach((game: Game) => game.tick());
    }

    end() {
        global.clearInterval(this.timer);
        delete this.timer;
    }
}