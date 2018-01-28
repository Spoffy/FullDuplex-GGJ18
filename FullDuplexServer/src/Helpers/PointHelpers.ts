import {IPoint} from "../Interfaces/IPoint";

export function manhattenDistance(a: IPoint, b: IPoint): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function inSquareRange(a: IPoint, b:IPoint, range: number) {
    let xDiff = Math.abs(a.x - b.x);
    let yDiff = Math.abs(a.y - b.y);
    return xDiff <= range && yDiff <= range;
}