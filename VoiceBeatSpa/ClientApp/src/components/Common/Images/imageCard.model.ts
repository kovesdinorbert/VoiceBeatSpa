import { ImageTypeEnum } from "./imageTypeEnum";
import { Guid } from "guid-typescript";

export interface IImage {
    id: Guid;
    title: string;
    body: string;
    fileContent: string;
    mimeType: string;
    imageType: ImageTypeEnum;
    loading: boolean;
  }
  