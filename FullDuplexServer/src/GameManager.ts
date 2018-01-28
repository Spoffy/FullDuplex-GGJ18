import {MemoryDataStore} from "./Storage/MemoryDataStore";
import {Snowflake, User, TextChannel} from "discord.js";
import {Game} from "./Game";
import {IUser} from "./Interfaces/IUser";
import {GameMap} from "./GameMap";
import {LoadMap} from "./MapLoader";

export class GameManager {
    private dataStore: MemoryDataStore;

    constructor(dataStore: MemoryDataStore) {
        this.dataStore = dataStore;
    }

    get games(): Array<Game> {
        return Object.keys(this.dataStore.playerGames).map((key) => this.dataStore.playerGames[key]);
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
        otherPlayer.send("You have been joined by: " + playerToJoin.user.tag);
        playerToJoin.send("You have joined a game with: " + otherPlayer.user.tag);

        //Role assignment
        let roleDesc = "";
        if(!openGame.avatarPlayer) {
            openGame.avatarPlayer = playerToJoin;
            roleDesc = "You are the wanderer. You'll need to ask for help, if you want to escape this place."
        } else {
            openGame.remotePlayer = playerToJoin;
            roleDesc = "You are acting as remote overseer. Help the wanderer reach the end of the maze.";
        }
        playerToJoin.send(roleDesc);

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
        let serializedMap = LoadMap("compound");
        let map = GameMap.fromString(serializedMap);

        let newGame = this.dataStore.playerGames[playerToJoin.user.id] = new Game(map, this);
        newGame.remotePlayer = playerToJoin;
        //newGame.avatarPlayer = playerToJoin;

        playerToJoin.send("A new game has been started! Wait for someone to join." +
            "\nYou are acting as remote overwatch. Help the wanderer reach the end of the maze.");

        return newGame;
    }

    quit(playerId: Snowflake): boolean {
        let game = this.findGameInProgress(playerId);
        if(!game) {
            return false;
        }
        let players = [game.avatarPlayer, game.remotePlayer];
        players.forEach((player) => {
            if(!player) { return; }
            delete this.dataStore.playerGames[player.user.id];
            if(player.user.id == playerId) {
                player.send("You have left the game and are free to join another game.");
            } else {
                player.send("The game has exited due to the other player leaving.");
            }
        });
        return true;
    }

    endGame(game: Game) {
        let player1 = game.avatarPlayer;
        let player2 = game.remotePlayer;

        delete this.dataStore.playerGames[player1.user.id];
        delete this.dataStore.playerGames[player2.user.id];
    }
}
