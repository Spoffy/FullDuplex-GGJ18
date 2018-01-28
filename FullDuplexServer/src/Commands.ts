import {ICommand} from "./Interfaces/ICommand";
import {Direction} from "./Direction";
import {DoorRoom} from "./GameObjects/Rooms/DoorRoom";
import {TextChannel} from "discord.js"
import {GameManager} from "./GameManager";
import {BooleanMapFilter, GameMap, PlayerFinderLayer} from "./GameMap";
import {packetizeAndSend} from "./Helpers/DiscordHelpers";
import {LoadMap} from "./MapLoader";
import {HelpMessages} from "./HelpMessages";
import {GameUser} from "./GameUser";

export class Commands {
    static ping: ICommand = (params, message, dataStore) => {
        GameUser.reply(message, "Pong!");
        return true;
    };

    static joingame: ICommand = (params, message, dataStore) => {
        let gameManager = new GameManager(dataStore);
        let playerToJoin = new GameUser(message.author, <TextChannel>message.channel, message.guild);

        if(gameManager.findGameInProgress(playerToJoin.user.id)) {
            playerToJoin.send("There is already a game in progress. Do you wish to abandon it? Use ?quit");
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
        if(!gameManager.quit(message.author.id)) {
            GameUser.reply(message, "You are not currently playing a game");
        }
        return true;
    };

    static look: ICommand = (params, message, dataStore) => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);

        if(!game) {
            GameUser.reply(message,"You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if(!game.isAvatarPlayer(message.author.id)) {
            player.send("You are not controlling a character, you are remotely accessing the site.")
            return;
        }
        player.send("You are in: " + game.avatar.room.description + "\n\n" + game.avatar.room.exitText);
        return true;
    };

    static move: ICommand = (params, message, dataStore): boolean => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);

        if(!game) {
            GameUser.reply(message, "You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if(!game.isAvatarPlayer(message.author.id)) {
            player.send("You are not controlling a character, you are remotely accessing the site.");
            return;
        }
        let direction = params[0] || "";
        if(!direction || !(Direction[direction.toUpperCase()])) {
            player.send("That is not a valid direction");
        }
        game.avatar.move(Direction[direction.toUpperCase()]).then(() =>{
               player.send("You move " + direction + " into a new room. You are in " + game.avatar.room.description +
                             "\n\n" + game.avatar.room.exitText);
           }, (reason) => {
               player.send("You try to move " + direction + ", but " + reason);
           });

        return true;
    };

    static n: ICommand = (params, message, dataStore) => Commands.move(["north"], message, dataStore);
    static e: ICommand = (params, message, dataStore) => Commands.move(["east"], message, dataStore);
    static s: ICommand = (params, message, dataStore) => Commands.move(["south"], message, dataStore);
    static w: ICommand = (params, message, dataStore) => Commands.move(["west"], message, dataStore);

    static transmitter: ICommand = (params, message, dataStore): boolean => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);

        if(!game) {
            GameUser.reply(message, "You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if(!game.isAvatarPlayer(message.author.id)) {
            player.send("You wish really, really hard that the wanderer would place a transmitter. Sadly, they're not telepathic.");
            return;
        }
        game.avatar.toggleTransmitter().then((operation) => {
            if(operation == "set") {
                player.send("You set the transmitter on the wall, where it's green light begins to flash softly.")
            } else {
                player.send("You pick up the transmitter and clip it to the waistband of your trousers.")
            }
        }, (operation) => {
            if(operation == "set") {
                if(game.avatar.transmitterCount <= 0) {
                    player.send("You don't have any transmitters left to place.")
                } else {
                    player.send("There's already a transmitter here. Placing a new one would cause interference.");
                }
            } else {
                player.send("There's no transmitter here to get.");
            }
        });
        return true;
    };

    static t: ICommand = (params, message, dataStore) => Commands.transmitter(params, message, dataStore);

    static doors: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];

        if(!game) {
            GameUser.reply(message, "You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if(!game.isRemotePlayer(message.author.id)) {
            player.send("You've seen quite a few doors in your lifetime.");
            return;
        }

        let response = game.map.doors.reduce((content: string, door: DoorRoom) => {
            let accessibility = door.isAccessible? "*OPEN*" : "**CLOSED**";
            let connectivity = game.inRangeOfTransmitter(door.coords)? "**CONNECTED**" : "*DISCONNECTED*";
            return content + `Door: **${door.name}** - __Connection__: ` + connectivity + "  - __State__: " + accessibility + "\n";
        }, "Command Accepted:\n");

        packetizeAndSend(response, player.send.bind(player));
        return true;
    };

    static open: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];

        if(!game) {
            GameUser.reply(message, "You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if(!game.isRemotePlayer(player.user.id)) {
            player.send("You don't feel like you could open any of the doors here... they're all sealed tight.");
            return;
        }
        let name = params[0] || "";
        let door: DoorRoom = game.map.doors.find((door) => door.name.toLowerCase() == name.toLowerCase());
        if(door) {
            if(!game.inRangeOfTransmitter(door.coords)) {
                player.send("Command Rejected: There is no connection to that door.");
                return;
            }
            door.isAccessible = true;
            player.send("Command Accepted: Opening door " + door.name);
            game.localMessage(door.coords, `The nearby door ${door.name} clunks loudly, releasing the lock before sliding open.`);
        } else {
            player.send("Command Rejected: No door exists with that identifier.");
        }
        return true;
    };

    static close: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];

        if(!game) {
            GameUser.reply(message, "You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if(!game.isRemotePlayer(message.author.id)) {
            player.send("You don't feel like you could close any of the doors here... there's nothing to grip!");
            return;
        }
        let name = params[0] || "";
        let door: DoorRoom = game.map.doors.find((door) => door.name.toLowerCase() == name.toLowerCase());
        if(door) {
            if(!game.inRangeOfTransmitter(door.coords)) {
                player.send("Command Rejected: There is no connection to that door.");
                return;
            }
            door.isAccessible = false;
            player.send("Command Accepted: Closing door " + door.name);
            game.localMessage(door.coords, `The nearby door ${door.name} groans and slides shut, locking with a dull thud.`);
        } else {
            player.send("Command Rejected: No door exists with that identifier.");
        }
        return true;
    };

    static map: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];

        if (!game) {
            GameUser.reply(message, "You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if (!game.isRemotePlayer(message.author.id)) {
            player.send("This place.... it dizzies you, and throws off your sense of direction. Perhaps if you " +
                "were to write it down, or ask your overseer?");
            return;
        }
        let response = "Command Accepted: Accessing map database...\n```" +
                GameMap.MAPKEY + "\n" +
                game.map.toVisual([BooleanMapFilter(game.knownMap)]) + "```";
        player.send(response);
    };

    static find: ICommand = (params, message, dataStore): boolean => {
        let game = dataStore.playerGames[message.author.id];

        if (!game) {
            GameUser.reply(message,"You are not currently in a game.");
            return;
        }

        let player = game.getUser(message.author.id);
        if (!game.isRemotePlayer(message.author.id)) {
            player.send("Try looking around, maybe you'll get lucky? Your overseer might know more though.");
            return;
        }
        let response = "Command Accepted: Accessing map database...\n```" +
            GameMap.MAPKEY + "\n" +
            "P = Player" + "\n" +
            game.map.toVisual([BooleanMapFilter(game.knownMap), PlayerFinderLayer(game.avatar)]) +
            "```";
        player.send(response);
    };

    static debug: ICommand = (params, message, dataStore): boolean => {
        let game = new GameManager(dataStore).findGameInProgress(message.author.id);
        //console.log(game.map.mapData.map((line) => line.map((room) => {if (room) return "x"})));
        //game.revealArea({x: 1, y: 1}, 1);
        //console.log(game.knownMap);
        //player.send("Hello world", {embed: {title: "Hello", description: "World", color: 0x40c41b, fields: [{name:"__Fish__", value:"Herring", inline: false}, {name:"3", value:"3"}]}});

        //console.log(game.avatar.transmitterRooms);
        //console.log(game.avatar.transmitterCount);
        //console.log(game.avatar.room.transmitter);
        //console.log(game.transmitterPower);
        //console.log(LoadMap("simple"));
        //console.log(game.avatar.room.adjacentRooms);
        return true;
    };

    static exit: ICommand = (params, message, dataStore): boolean => {
        let gameManager = new GameManager(dataStore);
        let game = gameManager.findGameInProgress(message.author.id);
        if(game && game.avatar.room.constructor.name.toString() == "ExitRoom") {
            game.exitReached();
        }
        return true;
    };

    static help: ICommand = (params, message, dataStore): boolean => {
        let helpText = HelpMessages.INTRO +
                       HelpMessages.GENERAL_COMMANDS +
                       HelpMessages.OVERSEER_COMMANDS +
                       HelpMessages.WANDERER_COMMANDS;
        packetizeAndSend(helpText, GameUser.reply.bind(null, message));
        return true;
    }
}