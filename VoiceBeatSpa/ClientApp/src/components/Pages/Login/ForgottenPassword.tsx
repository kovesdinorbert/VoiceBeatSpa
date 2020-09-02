import React from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { faEnvelopeSquare } from '@fortawesome/free-solid-svg-icons';

import './style.css';
import { FormattedMessage } from 'react-intl';

export interface IState {
  email: string;
  password: string;
}

export default class ForgottenPassword extends React.Component<any, IState>{

    public state: IState = {
      email : "",
      password : "",
    };

    public render() {    
      let confEmail : ITextInput = {
             label: <FormattedMessage id="login.email" defaultMessage={'Email cím'}/>,
             id: "email",
             required: true,
             icon: {icon: faEnvelopeSquare},
             type: 'email',
           }; 
        return (
          <div>
            <><TextInput config={confEmail} value={this.props.email} onInputValueChange={this.props.emailChange} enterPressed={this.props.enterPressed}></TextInput></>
          </div>
        );
    }
}