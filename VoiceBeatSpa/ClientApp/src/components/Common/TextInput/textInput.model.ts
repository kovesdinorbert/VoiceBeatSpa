import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export interface ITextInput {
    label?: JSX.Element,
    id: string,
    error: boolean,
    success: boolean,
    white: boolean,
    required?: boolean,
    icon?: FontAwesomeIconProps,
    type: string,
    otherProps?: any,
  }
  