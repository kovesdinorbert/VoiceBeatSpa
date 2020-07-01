import { CSSProperties } from '@material-ui/core/styles/withStyles';

export interface IImageSettings {
    showBody?: boolean;
    showTitle?: boolean;
    colCount?: number;
    width?: string;
    height?: string;
    cssProperties?: CSSProperties;
  }