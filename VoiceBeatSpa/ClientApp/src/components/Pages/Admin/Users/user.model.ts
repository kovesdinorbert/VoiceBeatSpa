import { Guid } from "guid-typescript";

export interface IUser {
    id: Guid,
    email: string,
    lastLogin: Date,
    phoneNumber: string,
    newsletter: boolean,
    reservationRuleAccepted: boolean,
  }