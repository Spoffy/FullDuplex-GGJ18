import {IMonster} from "../../Interfaces/IMonster";
import {IRoom} from "../../Interfaces/IRoom";
import {Game} from "../../Game";
import {Direction, oppositeDirection} from "../../Direction";

export class BaseMonster implements IMonster {
    room: IRoom;
    game: Game;

    angerSpeed = 5;

    description = "a deformed, rotting human with long, spiderlike limbs and chittering mandibles";
    creatureAngeringMessage = "The creature growls and fixes you with hungering eyes.";
    creatureKillingMessage = "The creature coils its iron legs around you, as the mandibles close in around your throat.";

    protected angered = false;
    public state = "";
    public savedState = "";
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
        let heading = this.searchForAvatar();
        if(heading) {
            this.game.avatarPlayer.send(this.description + " shuffles around off to the " + oppositeDirection(heading.dir));
        }
        this.game.sameRoomMessage(this.room.coords,this.description + " skitters into the room, eyeing you hungrily")
            .catch(() => {
                this.game.localMessage(this.room.coords, this.description + " moves around in an adjacent room");
            });

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
                this.attemptChase();
                break;
            case "chase":
                this.performChase();
                this.attemptChase();
                break;
            default:
                this.chooseBehaviour();
                this.attemptChase();
                break;
        }
    }

    attemptChase() {
        let heading = this.searchForAvatar();
        if(heading) {
            this.state = "chase";
            this.heading = heading;
        }
        this.setWait(1);
    }

    performChase() {
        if(!this.heading || this.heading.dist <= 0) {
            this.state = "";
            return this.tick();
        }
        this.moveToRoom(this.room[this.heading.dir]);
        this.heading.dist -= 1;
        this.setWait(2);
    }

    searchForAvatar() {
        let room: IRoom = this.room;
        let dist = 0;

        while(room.north && room.north.isAccessible) {
            room = room.north;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: Direction.NORTH, dist: dist};
            }
        }

        room = this.room;
        dist = 0;

        while(room.east && room.east.isAccessible) {
            room = room.east;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: Direction.EAST, dist: dist};
            }
        }

        room = this.room;
        dist = 0;

        while(room.south && room.south.isAccessible) {
            room = room.south;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: Direction.SOUTH, dist: dist};
            }
        }

        room = this.room;
        dist = 0;

        while(room.west && room.west.isAccessible) {
            room = room.west;
            dist += 1;
            if(this.game.avatar.room == room) {
                return {dir: Direction.WEST, dist: dist};
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
        if(this.angered) {
            this.state = "";
            return;
        }
        this.state = "sendWait";
        this.game.localMessage(this.room.coords, this.creatureAngeringMessage).then(() => {
            this.angered = true;
            this.setWait(3);
        });
    }

    setWait(time: number) {
        this.counterTarget = time;
        this.counter = 0;
        this.savedState = this.state;
        this.state = "wait";
    }

    performWait() {
        this.counter += 1;
        if(this.counter >= this.counterTarget) {
            this.counter = 0;
            this.state = this.savedState == "wait" || this.savedState == "sendWait"? "" : this.savedState;
        }
    }

    attackAvatar() {
        this.game.localMessage(this.room.coords, this.creatureKillingMessage);
        this.game.playerDeath();
    }

}