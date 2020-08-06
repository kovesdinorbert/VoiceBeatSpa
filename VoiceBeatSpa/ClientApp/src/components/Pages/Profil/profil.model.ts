import { Guid } from 'guid-typescript';
export interface IProfil {
    id?: Guid,
    phoneNumber: string,
    newsletter: boolean,
    socialLogin: boolean,
    newPassword?: string,
    oldPassword?: string,
    email: string,
  }
  