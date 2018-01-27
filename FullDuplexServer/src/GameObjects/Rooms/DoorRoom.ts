import {BaseRoom} from "./BaseRoom";

export class DoorRoom extends BaseRoom {
    inaccessibleReason = "a large, reinforced steel door blocks your path. There is no clear way to open it."
    isAccessible = false;

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