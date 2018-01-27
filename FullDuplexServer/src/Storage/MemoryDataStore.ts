import {Snowflake} from "discord.js";
import {Game} from "../Game";

export class MemoryDataStore {
    playerGames = {};

    getGame(playerId: Snowflake): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
           let game = this.playerGames[playerId];
           if(game) {
               resolve(game);
           }
           reject("No game found");
        });
    }
}