import React, { RefObject } from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { faEnvelopeSquare, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import { AuthenticationService } from '../../../services/authentication.service';
import Agree from '../../Common/Agree/Agree';
import { IRegister } from './register.model';
import ReCAPTCHA from 'react-google-recaptcha';
import Toastr from '../../Common/Toastr/Toastr';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import { FormattedMessage } from 'react-intl';
import { Container } from 'reactstrap';

import './registration.css';

export interface IState {
    email: string;
    phone: string;
    password: string;
    password2: string;
    passwordMismatch: boolean;
    newsletter: boolean;
    blocking : boolean, 
    r1accepted : boolean, 
    r2accepted : boolean, 
  }

export default class Registration extends React.Component<any>{
    public state: IState = {
      email : "",
      phone : "",
      password : "",
      password2 : "",
      passwordMismatch : false,
      newsletter : false,
      blocking : false, 
      r1accepted : false, 
      r2accepted : false, 
    };
    
    authenticationService: AuthenticationService = new AuthenticationService();
    toastrRef : RefObject<Toastr>;

    constructor(props: any) {
      super(props);
      
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePhoneChange = this.handlePhoneChange.bind(this);
      this.handleNewsletterChange = this.handleNewsletterChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.handlePassword2Change = this.handlePassword2Change.bind(this);
      this.onCaptchaChange = this.onCaptchaChange.bind(this);
      this.handleR1Change = this.handleR1Change.bind(this);
      this.handleR2Change = this.handleR2Change.bind(this);
      this.submit = this.submit.bind(this);
      this.delete = this.delete.bind(this);
      
      this.toastrRef = React.createRef();
    }
    
    handleEmailChange(email: string) {
      let cState = this.state;
      cState.email = email;
      this.setState(cState);
    }
  
    handlePhoneChange(phone: string) {
      let cState = this.state;
      cState.phone = phone;
      this.setState(cState);
    }
  
    handlePasswordChange(pw: string) {
      let cState = this.state;
      cState.password = pw;
      cState.passwordMismatch = pw !== this.state.password2;
      this.setState(cState);
    }
  
    handlePassword2Change(pw: string) {
      let cState = this.state;
      cState.password2 = pw;
      cState.passwordMismatch = pw !== this.state.password;
      this.setState(cState);
    }
    
    handleNewsletterChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({newsletter: event.target.checked});
    }
    
    handleR1Change(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({r1accepted: event.target.checked});
    }
    
    handleR2Change(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({r2accepted: event.target.checked});
    }

    onCaptchaChange(value: any) {
        console.log("Captcha value:", value);
    }

    submit() {
        let url = `${process.env.REACT_APP_API_PATH}/user`;
        if (!this.state.password || !this.state.email || !this.state.phone || this.state.password !== this.state.password2) {
            return;
        }
        this.setState({ blocking: true });
        let register: IRegister = {
            phoneNumber: this.state.phone,
            newsletter: this.state.newsletter,
            password: this.state.password,
            email: this.state.email,
        }
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(register)
        };
          
        fetch(url, requestOptions)
          .then(async response => {
            if (!response.ok) {
              this.toastrRef.current?.openSnackbar("Sikertelen regisztráció!", "error");
              } else {
                this.toastrRef.current?.openSnackbar("Regisztrációját kérjük erősítse meg az elküldött emailben található linkre kattintva!", "warning");
              }
              this.setState({oldPassword: "", blocking: false, newPassword1 : "", newPassword2 : "" });
            })
            .catch(error => {
              this.setState({oldPassword: "", blocking: false, newPassword1 : "", newPassword2 : "" });
              this.toastrRef.current?.openSnackbar("Sikertelen regisztráció!", "error");
            });
    }

    delete(){

    }

    public render() {
        let confEmail : ITextInput = {
               label: <FormattedMessage id="register.email" defaultMessage={'Email cím'}/>,
               id: "email",
               required: true,
               email: true,
               icon: {icon: faEnvelopeSquare},
               type: 'email',
             }; 
        let confPhone : ITextInput = {
               label: <FormattedMessage id="register.phone" defaultMessage={'Telefonszám'}/>,
               id: "subject",
               required: true,
               minLength: 7,
               icon: {icon: faPhone},
               type: 'text',
             };  
        let confPw : ITextInput = {
               label: <FormattedMessage id="register.password1" defaultMessage={'Jelszó'}/> ,
               id: "password",
               required: true,
               minLength: 8,
               icon: {icon: faLock},
               type: 'password',
             };  
        let confPw2 : ITextInput = {
               label: <FormattedMessage id="register.password2" defaultMessage={'Jelszó megerősítése'}/>,
               id: "password",
               required: true,
               icon: {icon: faLock},
               type: 'password',
             };  

      return (
        <div>
          <PageLoading show={this.state.blocking}></PageLoading>
          <div className="form-container registration-container">
              <h4 className="form-header-text"><FormattedMessage id="register" defaultMessage={'Regisztráció'}/></h4>
              <br />
              <><TextInput config={confEmail} value={this.state.email} onInputValueChange={this.handleEmailChange}></TextInput></>
              <><TextInput config={confPhone} value={this.state.phone} onInputValueChange={this.handlePhoneChange}></TextInput></>
              <><TextInput config={confPw} value={this.state.password} onInputValueChange={this.handlePasswordChange}></TextInput></>
              <><TextInput config={confPw2} value={this.state.password2} onInputValueChange={this.handlePassword2Change}></TextInput></>
              {this.state.passwordMismatch && <div className="validation-password-mismatch"><FormattedMessage id="passwordMismatch" defaultMessage={'A két jelszó nem egyezik'}/></div>}
              <Container><Agree text={<FormattedMessage id="register.newsletter" defaultMessage={'Hírlevél'}/>} handleChange={this.handleNewsletterChange}></Agree></Container>
              <ReCAPTCHA sitekey="Your client site key" onChange={this.onCaptchaChange} />
              <Container><Agree text={<FormattedMessage id="register.agree1" defaultMessage={''}/>} handleChange={this.handleR1Change}></Agree></Container>
              <Container><Agree text={<FormattedMessage id="register.agree2" defaultMessage={''}/>} handleChange={this.handleR2Change}></Agree></Container>
              <Container><Button className="btn-action" onClick={this.submit} disabled={!this.state.r1accepted || !this.state.r2accepted || this.state.password === "" || this.state.password2 === "" || this.state.passwordMismatch || this.state.phone === "" || this.state.phone.length < 7 || this.state.email === "" || !(/\S+@\S+\.\S+/.test(this.state.email)) || this.state.password.length < 8}><FormattedMessage id="save" defaultMessage={'Mentés'}/></Button></Container>
            <Toastr ref={this.toastrRef}></Toastr>
          </div>
        </div>
        );
    }
}