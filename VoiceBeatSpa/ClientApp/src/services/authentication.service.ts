import { BehaviorSubject, Observable } from 'rxjs';
import { ICurrentUser } from '../models/currentUser.model';

export class AuthenticationService  {
    public currentUserSubject: BehaviorSubject<ICurrentUser>;
    public currentUser: Observable<ICurrentUser>;
    private static _instance: AuthenticationService;

    _msRoleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    constructor() {
      let storedUser = localStorage.getItem('currentUser');
      if (storedUser !== null) {
        this.currentUserSubject = new BehaviorSubject<ICurrentUser>(JSON.parse(localStorage.getItem('currentUser') as string));
      } else {
        this.currentUserSubject = new BehaviorSubject<ICurrentUser>({email:"",token:""});
      }
      this.currentUser = this.currentUserSubject.asObservable();
    }

    instance() {
        if (!AuthenticationService._instance) {
            AuthenticationService._instance = new AuthenticationService();
        }
        return AuthenticationService._instance;
    }

    login(email: string, password: string) {
      const url = `${process.env.REACT_APP_API_PATH}/user/authenticate`;
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email : email,
          password : password
        })
      };
      
    fetch(url, requestOptions)
      .then(async response => {
        const data = await response.json();
      
        if (!response.ok) {
            const error = (data && data.message) || response.status;
          } else {
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.currentUserSubject.next(data);
          }
        })
        .catch(error => {
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next({email:"", token:""});
    }

    isAdmin(token: string) {
      if (token && token !== "") {
        const jwtData = token.split('.')[1];
        const decodedJwtJsonData = window.atob(jwtData);
        const decodedJwtData = JSON.parse(decodedJwtJsonData);
    
        if (decodedJwtData[this._msRoleClaim] === undefined || decodedJwtData[this._msRoleClaim] === null) {/*error*/
        } else if (!Array.isArray(decodedJwtData[this._msRoleClaim])) {
          return 'admin' === decodedJwtData[this._msRoleClaim].toString().toLowerCase();
        }
      }

      return false;
    }

    authHeader(token: string): Record<string,string>{
      if (token !== "") {
        return { Authorization: 'Bearer ' + token };
      } else {
        return {};
      }      
    }
}