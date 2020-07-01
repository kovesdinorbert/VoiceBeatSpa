import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoginForm from './LoginForm';
import { ILogin } from './login.model';
import { CircularProgress } from '@material-ui/core';
import BlockUi from 'react-block-ui';

import 'react-block-ui/style.css';
import { AuthenticationService } from '../../../services/authentication.service';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export interface IState {
  open: boolean;
  blocking: boolean;
  login: ILogin;
}

export default class LoginDialog extends React.Component<any, IState>{

  public state: IState = {
    open: false,
    blocking: false,
    login: {
      email : "",
      password : ""
    },
  };
  
  constructor(props: any) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.login = this.login.bind(this);
  }

  handleClose() {
    if (!this.state.blocking) {
      this.clearState();
    }
   };
   handleClickOpen() {
    this.setState({open: true});
   };
   
  handleEmailChange(email: string) {
    let cState = this.state;
    cState.login.email = email;
    this.setState(cState);
  }

  handlePasswordChange(pwd: string) {
    let cState = this.state;
    cState.login.password = pwd;
    this.setState(cState);
  }

  
  async submitLogin(e: any) {
    e.preventDefault();
    this.login();
  }

  login() {
    if (this.state.login.email != '' && this.state.login.password != ''){
      this.setState({blocking: true});
  
      new AuthenticationService().instance().login(this.state.login.email, this.state.login.password);
    }
  }

  clearState() {
    this.setState({
      open: false,
      blocking: false,
      login: {
        email : "",
        password : ""
      }});
  }
  
  public render() {    
    return (  
      <div>
        <Button onClick={this.handleClickOpen}>
          <FormattedMessage id="login" defaultMessage={'Belépés'}/>
        </Button>
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <BlockUi tag="div" blocking={this.state.blocking}>
              <DialogTitle id="form-dialog-title"><FormattedMessage id="login.login" defaultMessage={'Bejelentkezés'}/></DialogTitle>
              <DialogContent>
                <LoginForm emailChange={this.handleEmailChange} 
                           passwordChange={this.handlePasswordChange} 
                           enterPressed={this.login} 
                           email={this.state.login.email} 
                           password={this.state.login.password} />
              </DialogContent>
              <DialogActions>
                <Button onClick={e => this.submitLogin(e)} color="primary">
                  {!this.state.blocking ? <p><FormattedMessage id="login" defaultMessage={'Belépés'}/></p> : <CircularProgress />}
                </Button>
                <Button onClick={this.handleClose} color="primary">
                  <p><FormattedMessage id="cancel" defaultMessage={'Mégse'}/></p>
                </Button>
                <h3><FormattedMessage id="login.noaccount" defaultMessage={'Nincs még fiókod?'}/></h3>
                <Button onClick={_ => this.setState({open: false})}>
                  <NavLink to="/register"><p><FormattedMessage id="register" defaultMessage={'Regisztráció'}/></p></NavLink>
                </Button>
              </DialogActions>
            </BlockUi>
          </Dialog>
      </div>
      );
    }
}
