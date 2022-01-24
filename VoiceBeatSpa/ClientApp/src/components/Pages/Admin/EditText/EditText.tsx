import React, { RefObject } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { ILivingText } from '../../../Common/LivingText/livingText.model';
import { LivingTextTypeEnum } from '../../../Common/LivingText/livingTextTypeEnum';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { faSave  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './editText.css';
import { AuthenticationService } from '../../../../services/authentication.service';
import Toastr from '../../../Common/Toastr/Toastr';
import { PageLoading } from '../../../Common/PageLoading/PageLoading';
import { LanguageSelector } from '../../../Common/LanguageSelector/LanguageSelector';
import { Container } from 'reactstrap';

export interface IState {
  livingText: ILivingText;
  currentLanguage: string;
  loading: Boolean;
}

export default class EditText extends React.Component<any, IState>{
  public state: IState = {livingText: { loading : true,
                                        id: "",
                                        subject: "",
                                        livingTextType: LivingTextTypeEnum.StartPageText,
                                        isHtmlEncoded: true,
                                        text: "" },
                          loading: true,
                          currentLanguage: 'hu'  };
  newText: string = "";
                                
  authenticationService: AuthenticationService = new AuthenticationService();
  toastrRef : RefObject<Toastr>;
    
  constructor(props: any) {
    super(props);
    
    this.getLivingText = this.getLivingText.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.saveText = this.saveText.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    
    this.toastrRef = React.createRef();
  }

  public componentDidMount() {
      this.getLivingText(LivingTextTypeEnum.StartPageText, this.state.currentLanguage);
  }

  handleTextChange(content: string){
	this.newText = content;
  }

  private handleTypeChange = (event: any) => {
    event.preventDefault();
    this.getLivingText(event.target.value == 0 ? "0" : event.target.value, this.state.currentLanguage);
  }

  private getLivingText(type: LivingTextTypeEnum, lang: string) {
    this.setState({loading: true, currentLanguage: lang});
    fetch(process.env.REACT_APP_API_PATH+'/livingtext/type/'+type+'/'+lang)
      .then((res) => {
        if (res.ok) {
          res.json().then((livingText: ILivingText) => {
            livingText.loading = false; 
            this.setState({livingText: livingText, loading: false})
            }
          );
        } else {
          this.toastrRef.current?.openSnackbar("message.unsuccess.edittext", "error");
        }
      })
      .catch(error => {
          this.toastrRef.current?.openSnackbar("message.unsuccess.edittext", "error");
        });;
  }

  private saveText() {
    let url = `${process.env.REACT_APP_API_PATH}/livingtext/`+this.state.currentLanguage;
    
    let cState = this.state.livingText;
    cState.text = this.newText;

    this.setState({loading: true, livingText: cState});
    
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 
                 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
      body: JSON.stringify(cState)
    };
    
  fetch(url, requestOptions)
    .then(async response => {
      if (!response.ok) {
        this.toastrRef.current?.openSnackbar("message.unsuccess.save", "error");
      } else {
        this.toastrRef.current?.openSnackbar("message.success.save", "success");
      }
      this.setState({loading: false});
    })
    .catch(error => {
        this.toastrRef.current?.openSnackbar("message.unsuccess.save", "error");
      });
  }
  
  public handleLanguageChange = (e: string) => {
    this.getLivingText(this.state.livingText.livingTextType, e);
  }

  public render() {
    return (
      <div>
        <PageLoading show={this.state.loading}></PageLoading>
        <div>
          <Container className="selector-container">
            <FormControl variant="filled">
              <InputLabel htmlFor="text-type-select">Típus</InputLabel>
              <Select value={this.state.livingText.livingTextType} onChange={this.handleTypeChange} inputProps={{ name: 'Típus', id: 'text-type-select' }}>
                <MenuItem value={LivingTextTypeEnum.StartPageText}>Startlap</MenuItem>
                <MenuItem value={LivingTextTypeEnum.Services}>Szolgáltatások</MenuItem>
                <MenuItem value={LivingTextTypeEnum.DiscountsText}>Kedvezmények</MenuItem>
                <MenuItem value={LivingTextTypeEnum.PricesText}>Árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.PhoneNumber}>Menü telefonszám</MenuItem>
                <MenuItem value={LivingTextTypeEnum.ReservationRulesText}>Foglalási szabályok</MenuItem>
                <MenuItem value={LivingTextTypeEnum.EmailReservationSent}>Email - Foglalás elküldve</MenuItem>
                <MenuItem value={LivingTextTypeEnum.EmailRegistration}>Email - regisztráció</MenuItem>
                <MenuItem value={LivingTextTypeEnum.EmailForgottenPassword}>Email - elfelejtett jelszó</MenuItem>
                <MenuItem value={LivingTextTypeEnum.EmailReservationDelete}>Email - Foglalás törlés</MenuItem>
                <MenuItem value={LivingTextTypeEnum.RedRoomPrice}>Piros terem - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.RedRoomText}>Piros terem - leírás</MenuItem>
                <MenuItem value={LivingTextTypeEnum.BlueRoomPrice}>Kék terem - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.BlueRoomText}>Kék terem - leírás</MenuItem>
                <MenuItem value={LivingTextTypeEnum.GrayRoomPrice}>Szürke terem - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.GrayRoomText}>Szürke terem - leírás</MenuItem>
                <MenuItem value={LivingTextTypeEnum.StudioRoomPrice}>Stúdió - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.StudioRoomText}>Stúdió - leírás</MenuItem>
                <MenuItem value={LivingTextTypeEnum.MasterPrice}>Master árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.StudioPrice}>Stúdió óradíj</MenuItem>
                <MenuItem value={LivingTextTypeEnum.RehearsalRecord}>Próba felvétel - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.OnemanRehearsal}>Egyszemélyes próba - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.MonthlyRoom}>Havidíjas terem - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.NewEvent}>Rendezvény szervezés - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.CustomEvent}>Magánrendezvény - árak</MenuItem>
                <MenuItem value={LivingTextTypeEnum.RentAndShipInstrument}>Bérlés és szállítás - árak</MenuItem>
              </Select>
            </FormControl>
            <div className="language-selector-div">
              <FormControl variant="filled">
                <InputLabel htmlFor="text-type-select">Nyelv</InputLabel>
                <LanguageSelector locale={this.state.currentLanguage} changeLanguage={this.handleLanguageChange}></LanguageSelector>
              </FormControl>
            </div>
          </Container>
          <SunEditor
            onChange={this.handleTextChange}
            autoFocus={true} 
            setOptions={{
              icons: {},
              minHeight: '500px',
              buttonList: [['undo', 'redo'],
                           ['font', 'fontSize', 'formatBlock'],
                           ['paragraphStyle', 'blockquote'], 
                           ['bold', 'underline', 'italic'], 
                           ['fontColor', 'hiliteColor', 'textStyle'],
                           ['align', 'horizontalRule', 'list', 'lineHeight'],
                           ['table', 'link', 'image', 'video'],
                           ['fullScreen', 'showBlocks', 'codeView']]
            }}
            setContents={this.state.livingText.text}
          >
          </SunEditor>
          <Button onClick={this.saveText} className="btn-admin-save">
            <FontAwesomeIcon className="login-brand-icon" icon={faSave} />
          </Button>
        </div>
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
      );
    }
}