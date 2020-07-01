import { Guid } from "guid-typescript";
import { RoomTypeEnum } from "./roomTypeEnum";

export interface IEvent {
    id?: Guid
    subject: string,
    description: string,
    startDate: Date,
    endDate: Date,
    room: RoomTypeEnum
}