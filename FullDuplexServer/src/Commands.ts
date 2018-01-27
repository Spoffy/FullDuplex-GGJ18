import {ICommand} from "./Interfaces/ICommand";

export class Commands {
    public static ping: ICommand = (params, message, dataStore) => {
        message.reply("Pong!");
        return true;
    };
}