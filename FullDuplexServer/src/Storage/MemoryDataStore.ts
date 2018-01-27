import {Snowflake} from "discord.js";
import {Game} from "../Game";

export class MemoryDataStore {
    public playerGames = {};

    public getGame(playerId: Snowflake): Promise<Game> {
        return new Promise<Game>((resolve, reject) => {
           let game = this.playerGames[playerId];
           if(game) {
               resolve(game);
           }
           reject("No game found");
        });
    }
}