import {ICommand} from "./Interfaces/ICommand";
import {GameMap} from "./GameMap";
import {Game} from "./Game";

export class Commands {
    static ping: ICommand = (params, message, dataStore) => {
        message.reply("Pong!");
        return true;
    };

    static startgame: ICommand = (params, message, dataStore) => {
        if(dataStore.playerGames[message.author.id]) {
            message.reply("There is already a game in progress. Do you wish to abandon it? Use ?quit");
            return;
        }
        let serializedMap = "xxxx\nxxxx\nxxxx\nxxxx";
        let map = GameMap.fromString(serializedMap);

        dataStore.playerGames[message.author.id] = new Game(map);

        message.reply("A new game has been started!")
        return true;
    };

    static quit: ICommand = (params, message, dataStore) => {
        delete dataStore.playerGames[message.author.id];
        message.reply("You've quit your game, and can now start a new one.");
        return true;
    };

    static look: ICommand = (params, message, dataStore) => {
        let game = dataStore.playerGames[message.author.id];
        message.reply("You are in: ", )
        return true;
    }
}