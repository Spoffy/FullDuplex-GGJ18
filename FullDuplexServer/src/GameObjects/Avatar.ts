import {Game} from "../Game";

export class Avatar {
    game: Game;
    location = {x: 0, y: 0};

    constructor(game: Game) {
        this.game = game;
    };
}