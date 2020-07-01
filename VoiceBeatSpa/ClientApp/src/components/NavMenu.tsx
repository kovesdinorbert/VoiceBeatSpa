import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './NavMenu.css';
import { Subscription } from 'rxjs';

import RoomMenuOpen from "./RoomMenuOpen.js";

import { Button } from '@material-ui/core';
import LoginDialog from './Pages/Login/LoginDialog';
import { AuthenticationService } from '../services/authentication.service';
import { ICurrentUser } from '../models/currentUser.model';

import { FormattedMessage } from 'react-intl';

import logo from '../content/logo.png';
import { LanguageSelector } from './Common/LanguageSelector/LanguageSelector';

export interface IState {
  collapsed: boolean;
  currentUser: ICurrentUser;
  admin: boolean;
  locale: string;
}

export class NavMenu extends Component<any, IState> {
  static displayName = NavMenu.name;

  authenticationService: AuthenticationService = new AuthenticationService();
  obs: Subscription = new Subscription();

  constructor (props: any) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      collapsed: true,
      currentUser: {email: "", token: ""},
      admin: false,
      locale: this.props.currentLocale
    };
  }
  
  public componentDidMount() {
    this.obs = this.authenticationService.instance().currentUser.subscribe(val => {this.setState({currentUser: val, 
                                                                                       admin: this.authenticationService.instance().isAdmin(val.token)})});
  }

  componentWillUnmount() {
    this.obs.unsubscribe();
 }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  closeNavbar () {
    this.setState({
      collapsed: true
    });
  }

  logout () {
    this.closeNavbar();
    this.authenticationService.instance().logout();
  }

  render () { 
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 navbar-main" light>
          <Container>
              <div className="row"> 
                 <div className="col-md-5"> 
                   <img src={logo} className="logoImg" alt="Voice Beat próbaterem és stúdió"/> 
                </div>
                <div className="col-md-7"> 
                  <label className="menu-phone text-light">+36 30 710 0661</label>
                </div> 
              </div> 
            {/* <NavbarBrand to="/" src={}> */}
              {/* <div className="row"> */}
                {/* <div className="col-md-5"> */}
                  {/* <img src={logo} className="logoImg" alt="Voice Beat próbaterem és stúdió"/> */}
                {/* </div>
                <div className="col-md-7"> */}
                  {/* <label className="menu-phone">+36 30 710 0661</label> */}
                {/* </div> */}
              {/* </div> */}
            {/* </NavbarBrand> */}
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2 navbar-dark" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse text-light" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
              { !this.state.admin && 
                <>
                  <NavItem>
                    <NavLink exact className="text-dark" to="/about"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="about" defaultMessage={'Rólunk'}/></Button></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="text-dark" to="/news"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="news" defaultMessage={'Hírek'}/></Button></NavLink>
                  </NavItem>
                  <NavItem>
                    <RoomMenuOpen closeNavbar={this.closeNavbar}></RoomMenuOpen>
                  </NavItem>
                  <NavItem>
                    <NavLink className="text-dark" to="/reservation"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="reservation" defaultMessage={'Foglalás'}/></Button></NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="text-dark" to="/contact"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="contact" defaultMessage={'Kapcsolat'}/></Button></NavLink>
                  </NavItem>
                </> }
                { this.state.admin && 
                  <>
                    <NavItem>
                      <NavLink exact className="text-dark" to="/admin"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="admin" defaultMessage={'Adminisztráció'}/></Button></NavLink>
                    </NavItem>
                  </> }
                { this.state.currentUser.token !== "" && !this.state.admin && 
                  <NavItem><NavLink exact className="text-dark" to="/profil"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="profil" defaultMessage={'Profil'}/></Button></NavLink></NavItem> }
                { this.state.currentUser.token !== "" && !this.state.admin         
                  ? <NavItem><NavLink exact className="text-dark" to="/"><Button className="text-light" onClick={this.logout}><FormattedMessage id="logout" defaultMessage={'Kijelentkezés'}/></Button></NavLink></NavItem>
                  : <LoginDialog closeNavbar={this.closeNavbar} />}
                  <LanguageSelector locale={this.state.locale} changeLanguage={this.props.changeLanguage} setServiceValue={true}></LanguageSelector>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
