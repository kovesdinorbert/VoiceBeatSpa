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
import { faSignInAlt  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'reactstrap';
import ForgottenPassword from './ForgottenPassword';

export interface IState {
  open: boolean;
  blocking: boolean;
  forgottenPw: boolean;
  login: ILogin;
}

export default class LoginDialog extends React.Component<any, IState>{

  public state: IState = {
    open: false,
    blocking: false,
    forgottenPw: false,
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
    this.sendReminder = this.sendReminder.bind(this);

    this.props.closeNavbar();
  }

  handleClose() {

    this.props.closeNavbar();
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
  
  async sendReminder(e: any) {
    e.preventDefault();
    //TODO
  }

  login() {
    if (this.state.login.email != '' && this.state.login.password != ''){
      this.setState({blocking: true});
  
      new AuthenticationService().instance().login(this.state.login.email, this.state.login.password);
    }
  }

  clearState() {
    this.setState({
      forgottenPw: false,
      open: false,
      blocking: false,
      login: {
        email : "",
        password : ""
      }});
  }
  
  public render() {    
    return (  
      <div className="navbar-nav-item-flex">
        <Button className="text-light navbar-nav-item-flex nav-item-action-button" onClick={this.handleClickOpen}>
          <FontAwesomeIcon className="" icon={faSignInAlt} />
        </Button>
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <BlockUi tag="div" blocking={this.state.blocking}>
              <DialogTitle id="form-dialog-title">
                {this.state.forgottenPw ?<FormattedMessage id="forgottenPw" defaultMessage={'Elfelejtett jelszó'}/>
                                        :<FormattedMessage id="login.login" defaultMessage={'Bejelentkezés'}/>}
              </DialogTitle>
                {!this.state.forgottenPw
              ?<>
                <DialogContent>
                  <LoginForm emailChange={this.handleEmailChange} 
                             passwordChange={this.handlePasswordChange} 
                             enterPressed={this.login} 
                             email={this.state.login.email} 
                             password={this.state.login.password} />
                </DialogContent>
                <DialogActions className="login-dialog-actions">
                  <Container>
                    <NavLink onClick={_ => {this.setState({forgottenPw: true});}} className="forgotten-password" to="/about"><FormattedMessage id="forgottenPw" defaultMessage={'Elfelejtett jelszó'}/></NavLink>
                  </Container>
                  <Container>
                  <Button className="btn-action" onClick={e => this.submitLogin(e)} color="primary">
                    {!this.state.blocking ? <FormattedMessage id="login" defaultMessage={'Belépés'}/> : <CircularProgress />}
                  </Button>
                  <Button className="btn-action" onClick={this.handleClose} color="primary">
                    <FormattedMessage id="cancel" defaultMessage={'Mégse'}/>
                  </Button>
                  </Container>
                  <h3><FormattedMessage id="login.noaccount" defaultMessage={'Nincs még fiókod?'}/></h3>
                  <Button onClick={_ => {this.setState({open: false}); this.props.closeNavbar();}}>
                    <NavLink to="/register"><FormattedMessage id="register" defaultMessage={'Regisztráció'}/></NavLink>
                  </Button>
                </DialogActions>
              </>
              :<>
                 <DialogContent>
                   <ForgottenPassword emailChange={this.handleEmailChange} />
                 </DialogContent>
                 <DialogActions className="login-dialog-actions">
                   <Container>
                   <Button className="btn-action" onClick={e => this.sendReminder(e)} color="primary">
                     {!this.state.blocking ? <FormattedMessage id="newPassword" defaultMessage={'Új jelszó'}/> : <CircularProgress />}
                   </Button>
                   <Button className="btn-action" onClick={_ => {this.setState({forgottenPw: false});}} color="primary">
                     <FormattedMessage id="cancel" defaultMessage={'Mégse'}/>
                   </Button>
                   </Container>
                 </DialogActions>
               </>}
            </BlockUi>
          </Dialog>
      </div>
      );
    }
}
