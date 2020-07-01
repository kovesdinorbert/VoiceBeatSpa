import React from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeSquare, faLock,  } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitterSquare, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Button } from '@material-ui/core';

import './style.css';
import { FormattedMessage } from 'react-intl';

export interface IState {
  email: string;
  password: string;
}

export default class LoginForm extends React.Component<any, IState>{

    public state: IState = {
      email : "",
      password : "",
    };

    public render() {    
      let confEmail : ITextInput = {
             label: <FormattedMessage id="login.email" defaultMessage={'Email cím'}/>,
             id: "email",
             error: false,
             success: false,
             white: false,
             required: true,
             icon: {icon: faEnvelopeSquare},
             type: 'email',
           }; 
      let confPassword : ITextInput = {
             label: <FormattedMessage id="login.password" defaultMessage={'Jelszó'}/>,
             id: "password",
             error: false,
             success: false,
             white: false,
             required: true,
             icon: {icon: faLock},
             type: 'password',
           };  
        return (
          <div>
            <Button><FontAwesomeIcon className="login-brand-icon" icon={faFacebookF} /></Button>
            <Button><FontAwesomeIcon className="login-brand-icon" icon={faGoogle} /></Button>
            <Button><FontAwesomeIcon className="login-brand-icon" icon={faTwitterSquare} /></Button>
            <><TextInput config={confEmail} value={this.props.email} onInputValueChange={this.props.emailChange} enterPressed={this.props.enterPressed}></TextInput></>
            <><TextInput config={confPassword} value={this.props.password} onInputValueChange={this.props.passwordChange} enterPressed={this.props.enterPressed}></TextInput></>
          </div>
        );
    }
}