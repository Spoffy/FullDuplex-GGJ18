import {IMonster} from "../../Interfaces/IMonster";
import {IRoom} from "../../Interfaces/IRoom";
import {Game} from "../../Game";

export class BaseMonster implements IMonster {
    room: IRoom;
    game: Game;

    angerSpeed = 5;

    description = "a deformed, rotting human with long, spiderlike limbs and chittering mandibles";
    creatureAngeringMessage = "The creature growls and fixes you with hungering eyes.";
    creatureKillingMessage = "The creature coils its iron legs around you, as the mandibles close in around your throat.";

    protected angered = false;
    protected state = "";
    protected counter = 0;
    protected counterTarget = 0;
    protected heading = null;

    constructor(game: Game, room: IRoom) {
        this.game = game;
        this.room = room;
    }

    moveToRoom(room: IRoom): boolean {
        if(!room.isAccessible) {
            return false;
        }
        this.room.monsters.delete(this);
        this.room = room;
        this.room.monsters.add(this);

        //Remove angering to prevent insta-kills.
        this.angered = false;
        this.game.localMessage(this.room.coords,this.description + " skitters into the room, eyeing you hungrily");
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
                this.attemptChase()
                break;
            case "chase":
                this.performChase();
                this.attemptChase()
                break;
            default:
                this.chooseBehaviour();
                this.attemptChase()
                break;
        }
    }

    attemptChase() {
        let heading = this.searchForAvatar();
        if(heading) {
            this.state = "chase";
            this.heading = heading;
        }
    }

    performChase() {
        if(!this.heading || this.heading.dist <= 0) {
            this.state = "";
            return this.tick();
        }
        this.moveToRoom(this.room[this.heading.dir]);
        this.heading.dist -= 1;
    }

    searchForAvatar() {
        let room: IRoom = this.room;
        let dist = 0;

        while(room.north) {
            room = room.north;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: "north", dist: dist};
            }
        }

        room = this.room;
        dist = 0;

        while(room.east) {
            room = room.east;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: "east", dist: dist};
            }
        }

        room = this.room;
        dist = 0;

        while(room.south) {
            room = room.south;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: "south", dist: dist};
            }
        }

        room = this.room;
        dist = 0;

        while(room.west) {
            room = room.west;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: "west", dist: dist};
            }
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
        let adjacentRooms = this.room.adjacentRooms;
        let nextRoom = adjacentRooms[Math.floor(Math.random() * adjacentRooms.length)];
        this.moveToRoom(nextRoom);
        this.state = "";
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