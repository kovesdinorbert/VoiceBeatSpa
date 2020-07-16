import React, { RefObject } from 'react';
import { ITextInput } from '../../Common/TextInput/textInput.model';
import TextInput from '../../Common/TextInput/TextInput';
import { faEnvelopeSquare, faPhone  } from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import { AuthenticationService } from '../../../services/authentication.service';
import { Checkbox } from '@material-ui/core';
import Agree from '../../Common/Agree/Agree';
import { IProfil } from './profil.model';
import ConfirmDialog from '../../Common/ConfirmDialog/ConfirmDialog';
import Toastr from '../../Common/Toastr/Toastr';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import { FormattedMessage } from 'react-intl';

import './profil.css';
import { Container } from 'reactstrap';

export interface IState {
    email: string;
    phone: string;
    oldPassword?: string;
    newPassword1?: string;
    newPassword2?: string;
    newsletter: boolean;
    passwordchange: boolean;
    blocking : boolean, 
    deleteOpen : boolean, 
  }

export default class Profil extends React.Component<any>{
    public state: IState = {
      email : "",
      phone : "",
      newsletter : false,
      passwordchange : false,
      blocking : false, 
      deleteOpen : false, 
    };
    
    authenticationService: AuthenticationService = new AuthenticationService();
    toastrRef : RefObject<Toastr>;

    constructor(props: any) {
      super(props);
      
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePhoneChange = this.handlePhoneChange.bind(this);
      this.handleNewsletterChange = this.handleNewsletterChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
      this.handleNewPassword1Change = this.handleNewPassword1Change.bind(this);
      this.handleNewPassword2Change = this.handleNewPassword2Change.bind(this);
      this.submit = this.submit.bind(this);
      this.setDeleteDialogOpen = this.setDeleteDialogOpen.bind(this);
      this.doDelete = this.doDelete.bind(this);
      
      this.toastrRef = React.createRef();
    }
    
  public componentDidMount() {
    this.setState({blocking: true});
    const requestOptions = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
    };
    fetch(process.env.REACT_APP_API_PATH+'/user/'+this.authenticationService.instance().currentUserSubject.getValue().id, requestOptions)
      .then((res) => {
        if (res.ok) {
          res.json().then((profil: IProfil) => {
            this.setState({email: profil.email, phone: profil.phoneNumber, newsletter: profil.newsletter, blocking: false});
            }
          );
        } else {
          this.setState({blocking: false});
        }
      });
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
  
    handleNewPassword1Change(pw: string) {
      let cState = this.state;
      cState.newPassword1 = pw;
      this.setState(cState);
    }
  
    handleNewPassword2Change(pw: string) {
      let cState = this.state;
      cState.newPassword2 = pw;
      this.setState(cState);
    }
  
    handleOldPasswordChange(pw: string) {
      let cState = this.state;
      cState.oldPassword = pw;
      this.setState(cState);
    }
    
    handleNewsletterChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({newsletter: event.target.checked});
    }
    
    handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({passwordchange: event.target.checked});
        console.log(this.state.passwordchange);
    }

    submit() {
        let url = `${process.env.REACT_APP_API_PATH}/user`;
        if (this.state.passwordchange && this.state.newPassword1 !== this.state.newPassword2) {
            return;
        }
        this.setState({blocking: true });
        let profil: IProfil = {
            id: this.authenticationService.currentUserSubject.getValue().id,
            phoneNumber: this.state.phone,
            newsletter: this.state.newsletter,
            newPassword: this.state.newPassword1,
            oldPassword: this.state.oldPassword,
            email: this.state.email,
        }
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 
                     'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
          body: JSON.stringify(profil)
        };
          
        fetch(url, requestOptions)
          .then(async response => {
            if (!response.ok) {
              this.toastrRef.current?.openSnackbar("Sikertelen mentés!", "error");
              } else {
                this.toastrRef.current?.openSnackbar("Sikeres mentés!", "success");
              }
              this.setState({oldPassword: "", blocking: false, newPassword1 : "", newPassword2 : "" });
            })
            .catch(error => {
              this.setState({oldPassword: "", blocking: false, newPassword1 : "", newPassword2 : "" });
              this.toastrRef.current?.openSnackbar("Sikertelen mentés!", "error");
            });
    }

    setDeleteDialogOpen(open: boolean){
      this.setState({deleteOpen: open});
    }

    doDelete(){
      let url = `${process.env.REACT_APP_API_PATH}/user/`+this.authenticationService.currentUserSubject.getValue().id;
      this.setState({blocking: true});
      
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token }
      };
        
      fetch(url, requestOptions)
        .then(async response => {
          this.setState({blocking: false});
          if (!response.ok) {
            this.toastrRef.current?.openSnackbar("Sikertelen törlés! Kérjük vegye fel a kapcsolatot velünk", "error");
            } else {
              this.toastrRef.current?.openSnackbar("Sikeres törlés!", "error");
              this.authenticationService.instance().logout();
            }
          })
          .catch(error => {
            this.setState({blocking: false});
            this.toastrRef.current?.openSnackbar("Sikertelen törlés! Kérjük vegye fel a kapcsolatot velünk", "error");
          });
    }

    public render() {
        let confEmail : ITextInput = {
               label: <FormattedMessage id="profile.email" defaultMessage={'Email cím'}/>,
               id: "email",
               error: false,
               success: false,
               white: false,
               required: true,
               icon: {icon: faEnvelopeSquare},
               type: 'email',
             }; 
        let confPhone : ITextInput = {
               label: <FormattedMessage id="profile.phone" defaultMessage={'Telefonszám'}/>,
               id: "subject",
               error: false,
               success: false,
               white: false,
               required: true,
               icon: {icon: faPhone},
               type: 'text',
             };  
        let confPw : ITextInput = {
               label: <FormattedMessage id="profile.oldpassword" defaultMessage={'Régi jelszó'}/>,
               id: "oldPw",
               error: false,
               success: false,
               white: false,
               required: true,
               type: 'password',
             };  
        let confNewPw1 : ITextInput = {
               label: <FormattedMessage id="profile.new1password" defaultMessage={'Új jelszó'}/>,
               id: "newPw1",
               error: false,
               success: false,
               white: false,
               required: true,
               type: 'password',
             };  
        let confNewPw2 : ITextInput = {
               label: <FormattedMessage id="profile.new2password" defaultMessage={'Új jelszó megerősítése'}/>,
               id: "newPw2",
               error: false,
               success: false,
               white: false,
               required: true,
               type: 'password',
             };  

      return (
        <div>
          <PageLoading show={this.state.blocking}></PageLoading>
          <div className="form-container profil-container">
            <h4 className="form-header-text"><FormattedMessage id="profile.myprofile" defaultMessage={'Profilom'}/></h4>
            <br />
            <><TextInput config={confEmail} value={this.state.email} onInputValueChange={this.handleEmailChange}></TextInput></>
            <><TextInput config={confPhone} value={this.state.phone} onInputValueChange={this.handlePhoneChange}></TextInput></>
            <Container><Checkbox checked={this.state.newsletter} onChange={this.handleNewsletterChange}></Checkbox><FormattedMessage id="profile.newsletter" defaultMessage={'Hírlevél'}/></Container>
            <Container><Agree text={<FormattedMessage id="profile.changepassword" defaultMessage={'Jelszó módosítása'}/>} handleChange={this.handlePasswordChange}></Agree></Container>
            {this.state.passwordchange
            ?<>
              <><TextInput config={confPw} value={this.state.oldPassword} onInputValueChange={this.handleOldPasswordChange}></TextInput></>
              <><TextInput config={confNewPw1} value={this.state.newPassword1} onInputValueChange={this.handleNewPassword1Change}></TextInput></>
              <><TextInput config={confNewPw2} value={this.state.newPassword2} onInputValueChange={this.handleNewPassword2Change}></TextInput></>
            </>
            :<></>}
            <Container>
              <Button className="btn-action" onClick={_ => this.setState({deleteOpen: true})}><FormattedMessage id="delete" defaultMessage={'Törlés'}/></Button>
              <Button className="btn-action" onClick={this.submit}><FormattedMessage id="save" defaultMessage={'Mentés'}/></Button>
            </Container>
            <ConfirmDialog
              title={<FormattedMessage id="confirm" defaultMessage={'Megerősítés'}/>}
              open={this.state.deleteOpen}
              setOpen={this.setDeleteDialogOpen}
              onConfirm={this.doDelete}
            >
              <FormattedMessage id="profile.deleteconfirm" defaultMessage={'Biztos, hogy törli a profilját? Minden adata véglegesen elvész, és a 3 napon túli lefoglalt időpontok törlődni fognak!'}/>
              
            </ConfirmDialog>
        </div>
        <Toastr ref={this.toastrRef}></Toastr>
        </div>
        );
    }
}