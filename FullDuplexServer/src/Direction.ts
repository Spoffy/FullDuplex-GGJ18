export enum Direction {
    NORTH = "north",
    EAST = "east",
    SOUTH = "south",
    WEST = "west"
}

export function oppositeDirection(dir: Direction) {
    let lookup = {};
    lookup[Direction.NORTH] = Direction.SOUTH;
    lookup[Direction.EAST] = Direction.WEST;
    lookup[Direction.SOUTH] = Direction.NORTH;
    lookup[Direction.WEST] = Direction.EAST;
    return lookup[dir];
}