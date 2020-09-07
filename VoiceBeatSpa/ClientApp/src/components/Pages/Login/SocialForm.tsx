import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Button } from '@material-ui/core';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { GoogleLogin } from 'react-google-login';

import './style.scss';
import { AuthenticationService } from '../../../services/authentication.service';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import { FormattedMessage } from 'react-intl';

export interface IState {
  blocking: boolean;
}

export default class SocialForm extends React.Component<any, IState>{

    public state: IState = {
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
        return (
          <div>
            <PageLoading show={this.state.blocking}></PageLoading>
            <FacebookLogin 
              render={renderProps => (
                <Button  onClick={renderProps.onClick} className="facebook-button">
                  <FontAwesomeIcon className="login-brand-icon" icon={faFacebookF} />
                  <FormattedMessage id="login.withfacebook" defaultMessage={'Bejelentkezés Facebook fiókkal'}/>
                </Button>
              )}
              appId={process.env.REACT_APP_FACEBOOK_APPID+""}
              autoLoad={false}
              fields="email"
              callback={this.facebookResponse} />
            <br></br>
            <GoogleLogin
              render={renderProps => (
                <Button  onClick={renderProps.onClick} className="google-button">
                  <FontAwesomeIcon className="login-brand-icon" icon={faGoogle} />
                  <FormattedMessage id="login.withgoogle" defaultMessage={'Bejelentkezés Google fiókkal'}/>
                </Button>
              )}
              clientId={process.env.REACT_APP_GOOGLE_CLIENTID+""}
              buttonText=""
              onSuccess={this.googleResponse}
              onFailure={this.onFailure}
            />
          </div>
        );
    }
}