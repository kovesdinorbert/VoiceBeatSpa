import { LivingTextTypeEnum } from "./livingTextTypeEnum";
import { LivingTextPlaceholderEnum } from "./livingTextPlaceholderEnum";

export interface ILivingText {
    loading: boolean;
    id: string;
    text: string;
    subject: string;
    livingTextType: LivingTextTypeEnum;
    isHtmlEncoded: boolean;
    //livingTextPlaceholders: LivingTextPlaceholderEnum[];
  }
  