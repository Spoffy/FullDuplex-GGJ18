import {ICommand} from "./Interfaces/ICommand";
import {GameMap} from "./GameMap";
import {Game} from "./Game";
import {Direction} from "./Direction";
import {DoorRoom} from "./GameObjects/Rooms/DoorRoom";

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
        let serializedMap = "xxxx\nddxd\nxxxx\nxxxx\ndddddddddddddddddddddddddddddddddddd";
        let map = GameMap.fromString(serializedMap);

        let game = dataStore.playerGames[message.author.id] = new Game(map);
        game.remotePlayer = message.author.id;
        game.avatarPlayer = message.author.id;

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
        if(!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if(!game.isAvatarPlayer(message.author.id)) {
            message.reply("You are not controlling a character, you are remotely accessing the site.")
            return;
        }
        message.reply("You are in: " + game.avatar.room.description);
        return true;
    };

    static move: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];
        if(!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if(!game.isAvatarPlayer(message.author.id)) {
            message.reply("You are not controlling a character, you are remotely accessing the site.");
            return;
        }
        let direction = params[0];
        if(!direction || !(Direction[direction.toUpperCase()])) {
            message.reply("That is not a valid direction");
        }
        game.avatar.move(Direction[direction.toUpperCase()]).then(() =>{
               message.reply("You move " + direction + " into a new room. You are in " + game.avatar.room.description);
           }, (reason) => {
               message.reply("You try to move " + direction + ", but " + reason);
           });

        return true;
    };

    static doors: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];
        if(!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if(!game.isRemotePlayer(message.author.id)) {
            message.reply("You've seen quite a few doors in your lifetime.");
            return;
        }
        message.reply(game.map.doors.reduce((content: string, door: DoorRoom) => {
           return content + `Door: ${door.name} - __Status__: ` + (door.isAccessible? "**OPEN**" : "**CLOSED**") + "\n";
        }, "Command Accepted:\n"));
        return true;
    };

    static open: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];
        if(!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if(!game.isRemotePlayer(message.author.id)) {
            message.reply("You don't feel like you could open any of the doors here... they're all sealed tight.");
            return;
        }
        let name = params[0] || "";
        let door = game.map.doors.find((door) => door.name == name);
        if(door) {
            door.isAccessible = true;
            message.reply("Command Accepted: Opening door " + door.name);
        } else {
            message.reply("Command Rejected: No door exists with that identifier.");
        }
        return true;
    }
}