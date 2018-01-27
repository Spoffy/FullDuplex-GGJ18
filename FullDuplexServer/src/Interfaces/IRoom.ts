export interface IRoom {
    description: string;
    north: IRoom;
    east: IRoom;
    south: IRoom;
    west: IRoom;
}