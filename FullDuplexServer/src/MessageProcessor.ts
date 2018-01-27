import * as Discord from "discord.js";
import {MemoryDataStore} from "./Storage/MemoryDataStore";
import {Commands} from "./Commands";
import {ICommand} from "./Interfaces/ICommand";

export class MessageProcessor {
    private dataStore: MemoryDataStore;
    private commands: Array<ICommand>;

    constructor(dataStore: MemoryDataStore) {
        this.dataStore = dataStore;
    }

    processMessage(message: Discord.Message) {
        if(message.author.id == message.client.user.id) {
            //console.log("Not replying: This bot doesn't talk to itself.");
            return;
        }

        console.log(message.author.username, "said:", message.content);

        //2, as we need at least the command character.
        if(message.content.length < 2) {
            console.log("Empty message received, ignoring.");
            return;
        }

        let tokens = message.content.split(/\s+/);

        if(tokens[0][0] == "?") {
            return this.processCommand(tokens, message);
        }
    }

    private processCommand(tokens: string[], message: Discord.Message) {
        let command = tokens[0];
        let params = tokens.slice(1);

        if(command[0] == "?") {
            command = command.substr(1);
        }

        console.log("Running command", command, "with parameters", params);

        if(typeof Commands[command] == "function") {
            Commands[command](params, message, this.dataStore);
        } else {
            message.reply("Unknown command '" + command + "'");
        }
    }
}