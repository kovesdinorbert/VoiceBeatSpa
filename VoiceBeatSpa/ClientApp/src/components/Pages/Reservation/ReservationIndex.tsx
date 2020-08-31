import React from 'react';
import { AuthenticationService } from '../../../services/authentication.service';
import { ICurrentUser } from '../../../models/currentUser.model';
import Reservation from './Reservation';
import ReservationRules from './ReservationRules';
import { CircularProgress } from '@material-ui/core';

export interface IState {
    rulesAccepted: boolean;
    loading: boolean;
    currentUser: ICurrentUser;
  }

export default class ReservationIndex extends React.Component<any, IState>{
    public state: IState = { 
        rulesAccepted: false,
        loading: false,
        currentUser:  {email:"",token:"", phoneNumber:""} 
    };

    _isMounted: boolean;

    constructor(props:any){
      super(props);

      this._isMounted = false;
      this.onAcceptRules = this.onAcceptRules.bind(this);
    }
    
    authenticationService: AuthenticationService = new AuthenticationService();
    
    public componentDidMount() {
      this._isMounted = true;

      this.authenticationService.instance().currentUser.subscribe(val => this.isRulesAccepted(val));
      this.isRulesAccepted(this.state.currentUser);
    }

    componentWillUnmount() {
      this._isMounted = false;
      //TODO unsub
   }
    
    private isRulesAccepted(currentUser: ICurrentUser) {
      if (currentUser.id) {
          fetch(process.env.REACT_APP_API_PATH+'/user/isrulesaccepted/'+currentUser.id, {headers: this.authenticationService.authHeader(currentUser.token)})
            .then((res) => {
              if (this._isMounted) {
                if (res.ok) {
                  res.json().then((rulesAccepted: boolean) => {
                    this.setState({currentUser: currentUser, rulesAccepted: rulesAccepted})
                    }
                  );
                } else {
                    this.setState({currentUser: {email:"",token:"", phoneNumber:""}, rulesAccepted: false})
                }
            }});
      }
    }

    onAcceptRules(){
      if (this.state.currentUser.id){
        this.setState({loading: true});
        const formData = new FormData();
        formData.append('userId', this.state.currentUser.id.toString());
        let header:{[id: string] : string;} = {};
        header['Authorization'] = this.authenticationService.authHeader(this.state.currentUser.token)['Authorization'];
        const config: RequestInit = {
          method: 'post',
          headers: header,
          body: formData
        };
        fetch(process.env.REACT_APP_API_PATH+'/user/acceptrules', config)
          .then((res) => {
            if (res.ok) {
              res.json().then((rulesAccepted: boolean) => {
                this.setState({rulesAccepted: rulesAccepted, loading: false})
                }
              );
            }
            this.setState({loading: false});
          });
      }
    }

    public render() {
      return (
        <div>
            {this.state.loading
            ? <CircularProgress />
            : this.state.rulesAccepted 
              ? <Reservation></Reservation>
              : <ReservationRules isUser={this.state.currentUser.token !== ""} onAcceptRules={this.onAcceptRules}></ReservationRules>}
        </div>
      );
    }
}