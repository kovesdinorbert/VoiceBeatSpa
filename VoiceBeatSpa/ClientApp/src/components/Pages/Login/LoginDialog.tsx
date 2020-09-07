import React, { RefObject } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoginForm from './LoginForm';
import { ILogin } from './login.model';
import { CircularProgress } from '@material-ui/core';
import BlockUi from 'react-block-ui';
import { Subscription } from 'rxjs';

import 'react-block-ui/style.css';
import { AuthenticationService } from '../../../services/authentication.service';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { faSignInAlt  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'reactstrap';
import ForgottenPassword from './ForgottenPassword';
import Toastr from '../../Common/Toastr/Toastr';
import { LanguageService } from '../../../services/language.service';
import SocialForm from './SocialForm';

import './style.scss';

export interface IState {
  open: boolean;
  blocking: boolean;
  forgottenPw: boolean;
  forgottenPwSent: boolean;
  login: ILogin;
}

export default class LoginDialog extends React.Component<any, IState>{

  public state: IState = {
    open: false,
    blocking: false,
    forgottenPw: false,
    forgottenPwSent: false,
    login: {
      email : "",
      password : ""
    },
  };

  authenticationService: AuthenticationService = new AuthenticationService();
  obs: Subscription = new Subscription();
  toastrRef : RefObject<Toastr>;
  languageService: LanguageService = new LanguageService();
  
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
    this.toastrRef = React.createRef();
  }
  
  public componentDidMount() {
    this.obs = this.authenticationService.instance().currentUser.subscribe(val => {this.setState({blocking: false}); if (val.token === "") {
      this.toastrRef.current?.openSnackbar("Hibás felhasználónév vagy jelszó!", "error");}});
  }

  componentWillUnmount() {
    this.obs.unsubscribe();
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
    e?.preventDefault();
    const url = `${process.env.REACT_APP_API_PATH}/user/forgottenpassword`+'/'+this.languageService.instance().currentLanguageCode;
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.login.email)
    };
    
  fetch(url, requestOptions)
    .then(async response => {
        this.setState({forgottenPwSent: true});
      })
      .catch(error => {
      });
  }

  login() {
    if (this.state.login.email != '' && this.state.login.password != '' && (/\S+@\S+\.\S+/.test(this.state.login.email))){
      this.setState({blocking: true});
  
      this.authenticationService.instance().login(this.state.login.email, this.state.login.password);
    }
  }

  clearState() {
    this.setState({
      forgottenPw: false,
      forgottenPwSent: false,
      open: false,
      blocking: false,
      login: {
        email : "",
        password : ""
      }});
  }
  
  public render() {    
    return (  
      <div className="navbar-nav-item-flex login-container login-dialog-form">
        <Button className="text-light navbar-nav-item-flex nav-item-action-button" onClick={this.handleClickOpen}>
          <FontAwesomeIcon className="" icon={faSignInAlt} />
        </Button>
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <Toastr ref={this.toastrRef}></Toastr>
            <BlockUi tag="div" blocking={this.state.blocking}>
              <DialogTitle id="form-dialog-title" className="login-header">
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
                  <Button disabled={!(this.state.login.email != '' && this.state.login.password != '' && (/\S+@\S+\.\S+/.test(this.state.login.email)))} className="btn-action" onClick={e => this.submitLogin(e)} color="primary">
                    {!this.state.blocking ? <FormattedMessage id="login" defaultMessage={'Belépés'}/> : <CircularProgress />}
                  </Button>
                  <Button className="btn-action" onClick={this.handleClose} color="primary">
                    <FormattedMessage id="cancel" defaultMessage={'Mégse'}/>
                  </Button>
                  </Container>
                  <h3><FormattedMessage id="login.loginor" defaultMessage={'Vagy'}/></h3>
                  <DialogContent>
                    <SocialForm />
                  </DialogContent>
                  <br></br>
                  <h3><FormattedMessage id="login.noaccount" defaultMessage={'Nincs még fiókod?'}/></h3>
                  <Button onClick={_ => {this.setState({open: false}); this.props.closeNavbar();}}>
                    <NavLink to="/register"><FormattedMessage id="register" defaultMessage={'Regisztráció'}/></NavLink>
                  </Button>
                </DialogActions>
              </>
              :<>
                 <DialogContent>
                   <ForgottenPassword emailChange={this.handleEmailChange}  enterPressed={this.sendReminder} />
                   {this.state.forgottenPwSent && <div className="remainder-sent-text"><FormattedMessage id="forgottenPwSent" defaultMessage={'Emlékeztető kiküldve'}/></div>}
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
