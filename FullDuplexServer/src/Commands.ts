import {ICommand} from "./Interfaces/ICommand";
import {Direction} from "./Direction";
import {DoorRoom} from "./GameObjects/Rooms/DoorRoom";
import {TextChannel} from "discord.js"
import {GameManager} from "./GameManager";
import {BooleanMapFilter, GameMap, PlayerFinderLayer} from "./GameMap";

export class Commands {
    static ping: ICommand = (params, message, dataStore) => {
        message.reply("Pong!");
        return true;
    };

    static joingame: ICommand = (params, message, dataStore) => {
        let gameManager = new GameManager(dataStore);

        let playerToJoin = {user: message.author, channel: <TextChannel>message.channel, server: message.guild}
        if(gameManager.findGameInProgress(playerToJoin.user.id)) {
            message.reply("There is already a game in progress. Do you wish to abandon it? Use ?quit");
            return;
        }

        if(gameManager.findAndJoinOpenGame(playerToJoin)) {
            return;
        }

        gameManager.createNewGame(playerToJoin);
        return true;
    };

    static quit: ICommand = (params, message, dataStore) => {
        let gameManager: GameManager = new GameManager(dataStore);
        gameManager.quit(message.author.id);
        return true;
    };

    static look: ICommand = (params, message, dataStore) => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);
        if(!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if(!game.isAvatarPlayer(message.author.id)) {
            message.reply("You are not controlling a character, you are remotely accessing the site.")
            return;
        }
        message.reply("You are in: " + game.avatar.room.description + "\n\n" + game.avatar.room.exitText);
        return true;
    };

    static move: ICommand = (params, message, dataStore): boolean => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);
        if(!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if(!game.isAvatarPlayer(message.author.id)) {
            message.reply("You are not controlling a character, you are remotely accessing the site.");
            return;
        }
        let direction = params[0] || "";
        if(!direction || !(Direction[direction.toUpperCase()])) {
            message.reply("That is not a valid direction");
        }
        game.avatar.move(Direction[direction.toUpperCase()]).then(() =>{
               message.reply("You move " + direction + " into a new room. You are in " + game.avatar.room.description +
                             "\n\n" + game.avatar.room.exitText);
           }, (reason) => {
               message.reply("You try to move " + direction + ", but " + reason);
           });

        return true;
    };

    static n: ICommand = (params, message, dataStore) => Commands.move(["north"], message, dataStore);
    static e: ICommand = (params, message, dataStore) => Commands.move(["east"], message, dataStore);
    static s: ICommand = (params, message, dataStore) => Commands.move(["south"], message, dataStore);
    static w: ICommand = (params, message, dataStore) => Commands.move(["west"], message, dataStore);

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
           return content + `Door: **${door.name}** - __Status__: ` + (door.isAccessible? "*OPEN*" : "**CLOSED**") + "\n";
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
        let door = game.map.doors.find((door) => door.name.toLowerCase() == name.toLowerCase());
        if(door) {
            door.isAccessible = true;
            message.reply("Command Accepted: Opening door " + door.name);
        } else {
            message.reply("Command Rejected: No door exists with that identifier.");
        }
        return true;
    };

    static map: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];
        if (!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if (!game.isRemotePlayer(message.author.id)) {
            message.reply("This place.... it dizzies you, and throws off your sense of direction. Perhaps if you " +
                "were to write it down, or ask your overseer?");
            return;
        }
        let response = "Command Accepted: Accessing map database...\n```" +
                GameMap.MAPKEY + "\n" +
                game.map.toString() + "```";
        message.reply(response);
    };

    static find: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];
        if (!game) {
            message.reply("You are not currently in a game.");
            return;
        }
        if (!game.isRemotePlayer(message.author.id)) {
            message.reply("Try looking around, maybe you'll get lucky? Your overseer might know more though.");
            return;
        }
        let response = "Command Accepted: Accessing map database...\n```" +
            GameMap.MAPKEY + "\n" +
            "P = Player" + "\n" +
            game.map.toVisual([PlayerFinderLayer(game.avatar)]) +
            "```";
        message.reply(response);
    };



    static debug: ICommand = (params, message, dataStore): boolean => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);
        //console.log(game.map.mapData.map((line) => line.map((room) => {if (room) return "x"})));
        console.log(game.map.toVisual([BooleanMapFilter([[true, true, true, true]])]));
        return true;
    };

    static exit: ICommand = (params, message, dataStore): boolean => {
        let gameManager = new GameManager(dataStore);
        let game = gameManager.findGameInProgress(message.author.id);
        if(game.avatar.room.constructor.name.toString() == "ExitRoom") {
            gameManager.win(game);
        }
        return true;
    }
}