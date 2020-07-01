import { Guid } from 'guid-typescript';

export class ICurrentUser {
    id?: Guid;
    email: string = "";
    token: string = "";
 }