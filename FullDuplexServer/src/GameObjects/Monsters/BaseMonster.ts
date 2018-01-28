import {IMonster} from "../../Interfaces/IMonster";
import {IRoom} from "../../Interfaces/IRoom";
import {Game} from "../../Game";

export class BaseMonster implements IMonster {
    room: IRoom;
    game: Game;

    angerSpeed: 3;

    creatureAngeringMessage = "The creature growls and fixes you with hungering eyes.";
    creatureKillingMessage = "The creature swipes at you with barbed claws. After a flash of pain - nothing.";

    private sameRoomCounter = 0;

    constructor(game: Game, room: IRoom) {
        this.game = game;
        this.room = room;
    }

    tick() {
        if(this.game.avatar.room == this.room) {
            this.sameRoomCounter += 1;
            if(this.sameRoomCounter < this.angerSpeed) {
                this.game.localMessage(this.room.coords, this.creatureAngeringMessage);
            } else {
                this.game.localMessage(this.room.coords, this.creatureKillingMessage);
            }
        } else {
            this.sameRoomCounter = 0;
        }
    }

}