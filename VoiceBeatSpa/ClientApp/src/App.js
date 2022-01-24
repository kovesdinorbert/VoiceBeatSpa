import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import { Layout } from './components/Layout';
import About from './components/Pages/About/About';

import './custom.css'
import Calendar from './components/Pages/Admin/Calendar/Calendar';
import Admin from './components/Pages/Admin/Admin';
import Contact from './components/Pages/Contact/Contact';
import Profil from './components/Pages/Profil/Profil';
import Registration from './components/Pages/Registration/Registration';
import News from './components/Pages/News/News';
import ServicesRent from './components/Pages/Services/Rent';
import ServicesEvents from './components/Pages/Services/Events';
import ServicesRooms from './components/Pages/Services/Rooms';
import ServicesStudio from './components/Pages/Services/Studio';
import ReservationIndex from './components/Pages/Reservation/ReservationIndex';
import Red from './components/Pages/Rooms/Red';
import Gray from './components/Pages/Rooms/Gray';
import Blue from './components/Pages/Rooms/Blue';

import AuthRoute from './components/AuthRoute';
import { AuthenticationService } from './services/authentication.service'
import { VersionService } from './services/version.service'
import { LanguageService } from './services/language.service'
import messages_hu from './translation/hu.json';
import messages_en from './translation/en.json';
import { IntlProvider } from 'react-intl';
import RecoverPassword from './components/Pages/RecoverPassword/RecoverPassword';
import ActivateUser from './components/Pages/ActivateUser/ActivateUser';


const messages = {
  'hu': messages_hu,
  'en': messages_en
}

export default class App extends Component {
  static displayName = App.name;
  
  authenticationService = new AuthenticationService();
  versionService = new VersionService();
  languageService = new LanguageService();

  constructor (props) {
    super(props);

    let currentLanguage = localStorage.getItem('currentLanguage');

    this.state = {
      token: "",
      locale: currentLanguage == null ? "hu" : currentLanguage
    };

    this.languageService.instance().setCurrentLanguage(currentLanguage == null ? "hu" : currentLanguage);
  }
  
   changeLanguage = (locale) => {
    this.setState({
        locale
    });
}

  async componentDidMount() {
    await this.versionService.getServerVersion();
    this.authenticationService.instance().currentUser.subscribe(val => 
      {this.setState({token: val.token})});
  }

  
  render () {
    const msg = messages[this.state.locale];

    let admin = this.state.token != "" && this.authenticationService.instance().isAdmin(this.state.token);
      const adminRouteProps = {
        isAuthenticated: admin,
        redirectPath: '/about'
      };
      const reservationRouteProps = {
        isAuthenticated: !admin,
        redirectPath: '/about'
      };
      const profilRouteProps = {
        isAuthenticated: !admin && this.state.token,
        redirectPath: '/about'
      };
      const anonymRouteProps = {
        isAuthenticated: !this.state.token,
        redirectPath: '/about'
      };
    return (
      <IntlProvider key={this.state.locale} locale={this.state.locale} messages={msg}>
        <BrowserRouter>
        <Layout changeLanguage={this.changeLanguage} currentLocale={this.state.locale}>
          <Switch>
            <AuthRoute {...adminRouteProps} path='/calendar' component={Calendar} />
            <AuthRoute {...adminRouteProps} path='/admin' component={Admin} />
            <Route path='/contact' component={Contact} />
            <Route path='/news' component={News} />
            <AuthRoute {...reservationRouteProps} path='/reservation' component={ReservationIndex} />
            <AuthRoute {...profilRouteProps} path='/profil' component={Profil} />
            <Route path='/services/rooms' component={ServicesRooms} />
            <Route path='/services/rent' component={ServicesRent} />
            <Route path='/services/events' component={ServicesEvents} />
            <Route path='/services/studio' component={ServicesStudio} />
            <AuthRoute {...anonymRouteProps} path='/register' component={Registration} />
            <Route exact path='/about' component={About}/>
            <Route exact path='/recoverpassword' component={RecoverPassword}/>
            <Route exact path='/activateuser' component={ActivateUser}/>
            <Route exact path='/' component={About}/>
          </Switch>
        </Layout>
        </BrowserRouter>
      </IntlProvider>
    );
  }
}
