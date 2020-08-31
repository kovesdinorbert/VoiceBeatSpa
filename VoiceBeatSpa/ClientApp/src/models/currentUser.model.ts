import { Guid } from 'guid-typescript';

export class ICurrentUser {
    id?: Guid;
    email: string = "";
    phoneNumber: string = "";
    token: string = "";
 }