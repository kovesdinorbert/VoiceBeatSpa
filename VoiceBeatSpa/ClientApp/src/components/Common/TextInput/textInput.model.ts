import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export interface ITextInput {
    label?: JSX.Element,
    id: string,
    required?: boolean,
    email?: boolean,
    icon?: FontAwesomeIconProps,
    type: string,
    otherProps?: any,
  }
  