import {BaseRoom} from "./BaseRoom";

export class DoorRoom extends BaseRoom {
    private descriptionStart = "a short stretch of metal-walled corridor";

    get description(): string {
        return this.descriptionStart +
            (this.isAccessible?
                ". A large, dimly lit groove runs along each wall, the edges of a heavy, reinforced door barely visible within" :
                " blocked off by a reinforced automatic door, dotted with patches of rust.");
    }

    set description(mesg: string) {
        this.descriptionStart = mesg;
    }
}