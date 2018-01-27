import {Message} from "discord.js"
import {MemoryDataStore} from "../Storage/MemoryDataStore";

export type ICommand = (params: string[], message: Message, dataStore: MemoryDataStore) => boolean;