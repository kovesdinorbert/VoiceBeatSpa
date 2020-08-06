import React from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeSquare, faLock,  } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Button } from '@material-ui/core';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { GoogleLogin } from 'react-google-login';

import './style.css';
import { FormattedMessage } from 'react-intl';
import { AuthenticationService } from '../../../services/authentication.service';
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
    authenticationService: AuthenticationService = new AuthenticationService();

    facebookResponse = (response: any) => {
      this.setState({blocking: true});
      let url = `${process.env.REACT_APP_API_PATH}/user/facebookauthenticate`;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.accessToken)
      };
      
      fetch(url, requestOptions).then(r => {
          r.json().then(user => {
            this.setState({blocking: false});
            this.authenticationService.instance().socialLogin(user);
          });
      })
  };

  googleResponse = (response: any) => {
    this.setState({blocking: true});
    let url = `${process.env.REACT_APP_API_PATH}/user/googleauthenticate`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.tokenId)
    };
    
    fetch(url, requestOptions).then(r => {
        r.json().then(user => {
          this.setState({blocking: false});
          this.authenticationService.instance().socialLogin(user);
        });
    })
  };    

  onFailure = (error: any) => {
    this.setState({blocking: false});
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
            <PageLoading show={this.state.blocking}></PageLoading>
            <FacebookLogin 
              render={renderProps => (
                <Button  onClick={renderProps.onClick}><FontAwesomeIcon className="login-brand-icon" icon={faFacebookF} /></Button>
              )}
              appId={process.env.REACT_APP_FACEBOOK_APPID+""}
              autoLoad={false}
              fields="email"
              callback={this.facebookResponse} />
            <GoogleLogin
              render={renderProps => (
                <Button  onClick={renderProps.onClick}><FontAwesomeIcon className="login-brand-icon" icon={faGoogle} /></Button>
              )}
              clientId={process.env.REACT_APP_GOOGLE_CLIENTID+""}
              buttonText=""
              onSuccess={this.googleResponse}
              onFailure={this.onFailure}
            />
            <><TextInput config={confEmail} value={this.props.email} onInputValueChange={this.props.emailChange} enterPressed={this.props.enterPressed}></TextInput></>
            <><TextInput config={confPassword} value={this.props.password} onInputValueChange={this.props.passwordChange} enterPressed={this.props.enterPressed}></TextInput></>
          </div>
        );
    }
}