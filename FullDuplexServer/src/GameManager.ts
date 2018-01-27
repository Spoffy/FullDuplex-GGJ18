import {MemoryDataStore} from "./Storage/MemoryDataStore";
import {Snowflake, User, TextChannel} from "discord.js";
import {Game} from "./Game";
import {IUser} from "./Interfaces/IUser";
import {GameMap} from "./GameMap";

export class GameManager {
    private dataStore: MemoryDataStore;

    constructor(dataStore: MemoryDataStore) {
        this.dataStore = dataStore;
    }

    findGameInProgress(playerId: Snowflake): Game {
        return this.dataStore.playerGames[playerId];
    }

    findOpenGame(playerId: Snowflake): Game {
        return Object.keys(this.dataStore.playerGames).map((key) => this.dataStore.playerGames[key])
            .find((game: Game) => (!game.remotePlayer && game.avatarPlayer && game.avatarPlayer.user.id != playerId
                || !game.avatarPlayer && game.remotePlayer && game.remotePlayer.user.id != playerId));
    }

    joinOpenGame(openGame: Game, playerToJoin: IUser) {
        //Joining messages
        let otherPlayer = openGame.remotePlayer || openGame.avatarPlayer;
        otherPlayer.channel.send("You have been joined by: " + playerToJoin.user.tag, {reply: otherPlayer.user});
        playerToJoin.channel.send("You have joined a game with: " + otherPlayer.user.tag, {reply: playerToJoin.user});

        //Role assignment
        let roleDesc = "";
        if(!openGame.avatarPlayer) {
            openGame.avatarPlayer = playerToJoin;
            roleDesc = "You are the wanderer. You'll need to ask for help, if you want to escape this place."
        } else {
            openGame.remotePlayer = playerToJoin;
            roleDesc = "You are acting as remote overseer. Help the wanderer reach the end of the maze.";
        }
        playerToJoin.channel.send(roleDesc
            , {reply: playerToJoin.user});

        this.dataStore.playerGames[playerToJoin.user.id] = openGame;
        return;
    }

    findAndJoinOpenGame(playerToJoin: IUser): Game {
        let openGame = this.findOpenGame(playerToJoin.user.id);
        if(openGame) {
            this.joinOpenGame(openGame, playerToJoin);
        }
        return openGame;
    }

    createNewGame(playerToJoin: IUser): Game {
        //Create a new game, if none is available.
        let serializedMap = "xxxE\n" +
                            "  x \n" +
                            "xxx \n" +
                            "xx x\n" +
                            "dxxddddddddddddddddddddddddddddddddd\n";
        let map = GameMap.fromString(serializedMap);

        let newGame = this.dataStore.playerGames[playerToJoin.user.id] = new Game(map);
        newGame.remotePlayer = playerToJoin;
        newGame.avatarPlayer = playerToJoin;

        playerToJoin.channel.send("A new game has been started! Wait for someone to join." +
            "\nYou are acting as remote overwatch. Help the wanderer reach the end of the maze.",
            {reply: playerToJoin.user});

        return newGame;
    }

    quit(playerId: Snowflake) {
        let game = this.findGameInProgress(playerId);
        let player = game.avatarPlayer.user.id == playerId? game.avatarPlayer : game.remotePlayer;
        let otherPlayer = game.avatarPlayer.user.id == playerId? game.remotePlayer : game.avatarPlayer;
        delete this.dataStore.playerGames[player.user.id];
        if(otherPlayer) {
            delete this.dataStore.playerGames[otherPlayer.user.id];
            otherPlayer.channel.send("The other player has left the game, so the game jhas exited.", {reply: otherPlayer.user});
        }
        player.channel.send("You have left the game, and are free to join another game.");
    }

    win(game: Game) {
        game.avatarPlayer.channel.send("You did it!");
        game.remotePlayer.channel.send("You did it!");
    }
}