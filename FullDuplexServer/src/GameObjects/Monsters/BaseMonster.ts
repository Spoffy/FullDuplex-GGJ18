import {IMonster} from "../../Interfaces/IMonster";
import {IRoom} from "../../Interfaces/IRoom";
import {Game} from "../../Game";

export class BaseMonster implements IMonster {
    room: IRoom;
    game: Game;

    angerSpeed = 5;

    creatureAngeringMessage = "The creature growls and fixes you with hungering eyes.";
    creatureKillingMessage = "The creature swipes at you with barbed claws. After a flash of pain - nothing.";

    protected angered = false;
    protected state = "";
    protected counter = 0;
    protected counterTarget = 0;

    constructor(game: Game, room: IRoom) {
        this.game = game;
        this.room = room;
    }

    moveToRoom(room: IRoom): boolean {
        this.room.monsters.delete(this);
        this.room = room;
        this.room.monsters.add(this);
        return true;
    }

    tick() {
        switch(this.state) {
            case "wait":
                this.performWait();
                break;
            case "sendWait":
                break;
            case "wandering":
                this.performWandering();
                break;
            default:
                this.chooseBehaviour();
                break;
        }
    }

    chooseBehaviour() {
        if(this.game.avatar.room == this.room) {
            if(!this.angered) {
                this.performAngering();
            } else {
                this.attackAvatar();
            }
        } else {
            this.state = "wandering";
        }
    }

    performWandering() {
        let validDirections = this.room.adjacentRooms;
    }

    performAngering() {
        this.state = "sendWait";
        this.game.localMessage(this.room.coords, this.creatureAngeringMessage).then(() => {
            this.angered = true;
            this.state = "wait";
            this.counterTarget = 2;
        });
    }

    performWait() {
        this.counter += 1;
        if(this.counter >= this.counterTarget) {
            this.counter = 0;
            this.state = "";
        }
    }

    attackAvatar() {
        this.game.localMessage(this.room.coords, this.creatureKillingMessage);
        this.game.playerDeath();
    }

}