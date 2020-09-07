import React from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { faEnvelopeSquare, faLock,  } from '@fortawesome/free-solid-svg-icons';

import './style.scss';
import { FormattedMessage } from 'react-intl';
import { PageLoading } from '../../Common/PageLoading/PageLoading';

export interface IState {
  email: string;
  password: string;
  blocking: boolean;
}

export default class LoginForm extends React.Component<any, IState>{

    public state: IState = {
      email : "",
      password : "",
      blocking : false,
    };

    public render() {    
      let confEmail : ITextInput = {
             label: <FormattedMessage id="login.email" defaultMessage={'Email cím'}/>,
             id: "email",
             required: true,
             email: true,
             icon: {icon: faEnvelopeSquare},
             type: 'email',
           }; 
      let confPassword : ITextInput = {
             label: <FormattedMessage id="login.password" defaultMessage={'Jelszó'}/>,
             id: "password",
             required: true,
             icon: {icon: faLock},
             type: 'password',
           };  
        return (
          <div>
            <PageLoading show={this.state.blocking}></PageLoading>
            <><TextInput config={confEmail} value={this.props.email} onInputValueChange={this.props.emailChange} enterPressed={this.props.enterPressed}></TextInput></>
            <><TextInput config={confPassword} value={this.props.password} onInputValueChange={this.props.passwordChange} enterPressed={this.props.enterPressed}></TextInput></>
          </div>
        );
    }
}