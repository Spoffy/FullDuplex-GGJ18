import {BaseRoom} from "./BaseRoom";

export class DoorRoom extends BaseRoom {
    baseDescription = "a short stretch of metal-walled corridor";
    mapCharacter = "d";

    name: string;
    isAccessible = false;


    constructor(name = "Dev Door - A Portal to Wonder") {
        super();
        this.name = name;
    }

    get inaccessibleReason(): string {
        return `a large, reinforced steel door blocks your path. On it printed in large, red letters is "${this.name}". There is no clear way to open it.`
    }

    set inaccessibleReason(reason: string) {}

    get description(): string {
        return this.baseDescription +
              (this.isAccessible?
                `. The edges of a heavy, reinforced door are barely visible nestled within the walls. Nearby is a sign saying "${this.name}".` :
                ` blocked off by a reinforced automatic door, dotted with patches of rust. On it, printed in large, red letters is "${this.name}".`) +
              this.transmitterText;
    }

    set description(mesg: string) {
        this.baseDescription = mesg;
    }
}