import { Guid } from 'guid-typescript';
export interface IRecoverPassword {
    id: Guid,
    password1: string,
    password2: string
  }
  