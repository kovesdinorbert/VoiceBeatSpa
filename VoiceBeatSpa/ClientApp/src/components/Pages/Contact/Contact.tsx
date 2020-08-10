import React, { RefObject } from 'react';
import GMap from './Map';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { faEnvelopeSquare, faUserCircle, faBook  } from '@fortawesome/free-solid-svg-icons';
import ReCAPTCHA from "react-google-recaptcha";
import Button from '@material-ui/core/Button';
import { IEmail } from './email.model';
import { AuthenticationService } from '../../../services/authentication.service';
import Toastr from '../../Common/Toastr/Toastr';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import { FormattedMessage } from 'react-intl';

import './contact.css';

export interface IState {
    email: string;
    name: string;
    subject: string;
    body: string;
    blocking : boolean, 
    showMessage : boolean, 
    formIsValid : boolean, 
  }

export default class Contact extends React.Component<any>{
    public state: IState = {
      email : "",
      name : "",
      subject : "",
      body : "",
      blocking : false, 
      showMessage : false, 
      formIsValid : false, 
    };
    
    authenticationService: AuthenticationService = new AuthenticationService();
    toastrRef : RefObject<Toastr>;

    constructor(props: any) {
      super(props);
      
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleSubjectChange = this.handleSubjectChange.bind(this);
      this.handleContentChange = this.handleContentChange.bind(this);
      this.onCaptchaChange = this.onCaptchaChange.bind(this);
      this.sendEmail = this.sendEmail.bind(this);
      
      this.toastrRef = React.createRef();
    }
    
    handleEmailChange(email: string) {
      let cState = this.state;
      cState.email = email;
      cState.formIsValid = !(this.state.body === "" || this.state.email === "" || !(/\S+@\S+\.\S+/.test(this.state.email)));
      this.setState(cState);
    }
  
    handleNameChange(name: string) {
      let cState = this.state;
      cState.name = name;
      this.setState(cState);
    }
  
    handleSubjectChange(subject: string) {
      let cState = this.state;
      cState.subject = subject;
      this.setState(cState);
    }
  
    handleContentChange(content: string) {
      let cState = this.state;
      cState.body = content;
      cState.formIsValid = !(this.state.body === "" || this.state.email === "" || !(/\S+@\S+\.\S+/.test(this.state.email)));
      this.setState(cState);
    }

    onCaptchaChange(value: any) {
        console.log("Captcha value:", value);
    }

    sendEmail() {
      if (!this.state.formIsValid) {
        return;
      }

      let url = `${process.env.REACT_APP_API_PATH}/contact`;
      this.setState({blocking: true});
      
      let email: IEmail = {
        subject: this.state.subject,
        body: this.state.body,
        email: this.state.email,
        name: this.state.name,
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
        body: JSON.stringify(email)
      };
        
      fetch(url, requestOptions)
        .then(async response => {
          if (!response.ok) {
            } else {
              this.toastrRef.current?.openSnackbar("Sikertelen üzenet küldés!", "error");
            }
            this.toastrRef.current?.openSnackbar("Sikeres üzenet küldés!", "success");
            this.setState({body: "", blocking: false, subject : "", name : "", email: "", showMessage: true });
          })
          .catch(error => {
            this.toastrRef.current?.openSnackbar("Sikertelen üzenet küldés!", "error");
          });
    }

    public render() {
        let confEmail : ITextInput = {
               label: <FormattedMessage id="contact.email" defaultMessage={'Email'}/>,
               id: "email",
               required: true,
               email: true,
               icon: {icon: faEnvelopeSquare},
               type: 'email',
             }; 
        let confName : ITextInput = {
               label: <FormattedMessage id="contact.name" defaultMessage={'Név'}/>,
               id: "name",
               icon: {icon: faUserCircle},
               type: 'text',
             };  
        let confSubject : ITextInput = {
               label: <FormattedMessage id="contact.subject" defaultMessage={'Tárgy'}/>,
               id: "subject",
               icon: {icon: faBook},
               type: 'text',
             };  
        let confContent : ITextInput = {
               label: <FormattedMessage id="contact.message" defaultMessage={'Üzenet'}/>,
               id: "subject",
               required: true,
               type: 'text',
               otherProps: { multiline: true,  rows: 6 }
             };  

      return (
        <div>
          <PageLoading show={this.state.blocking}></PageLoading>
          <div className="contact-container">
            <div className="form-container">
                <h4 className="form-header-text"><FormattedMessage id="contact.leavemessage" defaultMessage={'Hagyj üzenetet!'}/></h4>
                <br />
                <><TextInput config={confName} value={this.state.name} onInputValueChange={this.handleNameChange}></TextInput></>
                <><TextInput config={confEmail} value={this.state.email} onInputValueChange={this.handleEmailChange}></TextInput></>
                <><TextInput config={confSubject} value={this.state.subject} onInputValueChange={this.handleSubjectChange}></TextInput></>
                <><TextInput config={confContent} value={this.state.body} onInputValueChange={this.handleContentChange}></TextInput></>
                <ReCAPTCHA sitekey="Your client site key" onChange={this.onCaptchaChange} />
                <Button disabled={!this.state.formIsValid} className="btn-send-email" onClick={this.sendEmail}><FormattedMessage id="contact.send" defaultMessage={'Küldés'}/></Button>
            </div>
            <div className="map-container">
                <div>
                    <address>
                        <FormattedMessage id="contact.us" defaultMessage={'Voice-Beat próbaterem és stúdió'}/><br />
                        <FormattedMessage id="contact.address" defaultMessage={'Címünk: 1033 Budapest, Bogdáni út 1.'}/><br />
                        <abbr title="Phone"><FormattedMessage id="contact.phone" defaultMessage={'Telefonszám'}/>: </abbr>
                        (30) 710 0661<br />
                        <FormattedMessage id="contact.email" defaultMessage={'Email'}/>: <a href="mailto:voicebeat.bt@gmail.com">voicebeat.bt@gmail.com</a>
                    </address>
                </div>
                <div>
                    <div className="" id="dvMap"><GMap></GMap></div>
                </div>
            </div>
          </div>
          <Toastr ref={this.toastrRef}></Toastr>
        </div>
        );
    }
}