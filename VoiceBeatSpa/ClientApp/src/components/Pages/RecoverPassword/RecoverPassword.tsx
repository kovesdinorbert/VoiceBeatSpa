import React, { RefObject } from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { AuthenticationService } from '../../../services/authentication.service';
import Toastr from '../../Common/Toastr/Toastr';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import { FormattedMessage } from 'react-intl';
import { IRecoverPassword } from './recoverPassword.model';
import { Button, Container } from '@material-ui/core';

export interface IState {
    password1?: string;
    password2?: string;
    passwordMismatch: boolean;
    blocking : boolean, 
  }

export default class RecoverPassword extends React.Component<any>{
    public state: IState = {
        password1: "",
        password2: "",
        passwordMismatch : false,
      blocking : false, 
    };
    
    authenticationService: AuthenticationService = new AuthenticationService();
    toastrRef : RefObject<Toastr>;

    constructor(props: any) {
      super(props);
      
      this.handleNewPassword1Change = this.handleNewPassword1Change.bind(this);
      this.handleNewPassword2Change = this.handleNewPassword2Change.bind(this);
      this.submit = this.submit.bind(this);
      
      this.toastrRef = React.createRef();
    }
    
    handleNewPassword1Change(pw: string) {
      let cState = this.state;
      cState.password1 = pw;
      cState.passwordMismatch = pw !== this.state.password2;
      this.setState(cState);
    }
  
    handleNewPassword2Change(pw: string) {
      let cState = this.state;
      cState.password2 = pw;
      cState.passwordMismatch = pw !== this.state.password1;
      this.setState(cState);
    }

    submit() {
        let url = `${process.env.REACT_APP_API_PATH}/user/recoverpassword`;
        if (this.state.password1 !== this.state.password2) {
            return;
        }
        this.setState({blocking: true });
        let model: IRecoverPassword = {
            id: this.props.location.search.toString().replace('?',''),
            password1: this.state.password1 ?? "",
            password2: this.state.password2 ?? "",
        }
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(model)
        };
          
        fetch(url, requestOptions)
          .then(async response => {
            if (!response.ok) {
              this.toastrRef.current?.openSnackbar("Sikertelen módosítás!", "error");
              } else {
                this.toastrRef.current?.openSnackbar("Sikeres jelszócsere, bejelentkezhet az új jelszóval!", "success");
              }
              this.setState({password1 : "", password2 : "", blocking: false });
            })
            .catch(error => {
              this.setState({blocking: false, password1 : "", password2 : "" });
              this.toastrRef.current?.openSnackbar("Sikertelen módosítás!", "error");
            });
    }

    public render() {
        let confNewPw1 : ITextInput = {
               label: <FormattedMessage id="profile.new1password" defaultMessage={'Új jelszó'}/>,
               id: "newPw1",
               required: true,
               minLength: 8,
               type: 'password',
             };  
        let confNewPw2 : ITextInput = {
               label: <FormattedMessage id="profile.new2password" defaultMessage={'Új jelszó megerősítése'}/>,
               id: "newPw2",
               required: true,
               minLength: 8,
               type: 'password',
             };  

      return (
        <div>
          <PageLoading show={this.state.blocking}></PageLoading>
          <div className="form-container profil-container">
            <h4 className="form-header-text"><FormattedMessage id="newPassword" defaultMessage={'Új jelszó'}/></h4>
            <br />
              <><TextInput config={confNewPw1} value={this.state.password1} onInputValueChange={this.handleNewPassword1Change}></TextInput></>
              <><TextInput config={confNewPw2} value={this.state.password2} onInputValueChange={this.handleNewPassword2Change}></TextInput></>
              {this.state.passwordMismatch && <div className="validation-password-mismatch"><FormattedMessage id="passwordMismatch" defaultMessage={'A két jelszó nem egyezik'}/></div>}
            <Container>
              <Button className="btn-action" onClick={this.submit}><FormattedMessage id="save" defaultMessage={'Mentés'}/></Button>
            </Container>
        </div>
        <Toastr ref={this.toastrRef}></Toastr>
        </div>
        );
    }
}