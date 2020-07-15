import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavItem, NavbarBrand } from 'reactstrap';
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
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LivingTextTypeEnum } from './Common/LivingText/livingTextTypeEnum';
import LivingText from './Common/LivingText/LivingText';

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
        <div className="navbar-main">
          <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white box-shadow">
                <NavbarBrand className="header-logo" href="/"><img src={logo} className="logoImg" alt="Voice Beat próbaterem és stúdió"/></NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} className="mr-2 navbar-dark" />
                <Collapse className="d-sm-inline-flex text-light" isOpen={!this.state.collapsed} navbar style={{flexBasis:"100%"}}>
                  <ul className="navbar-nav flex-grow navbar-actions">
                  { !this.state.admin && 
                    <>
                      <NavItem className="navbar-nav-item navbar-nav-item-flex">
                        <NavLink exact className="text-dark" to="/about"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="about" defaultMessage={'Rólunk'}/></Button></NavLink>
                      </NavItem>
                      <NavItem className="navbar-nav-item navbar-nav-item-flex">
                        <NavLink className="text-dark" to="/news"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="news" defaultMessage={'Hírek'}/></Button></NavLink>
                      </NavItem>
                      <NavItem className="navbar-nav-item navbar-nav-item-flex">
                        <RoomMenuOpen closeNavbar={this.closeNavbar}></RoomMenuOpen>
                      </NavItem>
                      <NavItem className="navbar-nav-item navbar-nav-item-flex">
                        <NavLink className="text-dark" to="/reservation"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="reservation" defaultMessage={'Foglalás'}/></Button></NavLink>
                      </NavItem>
                      <NavItem className="navbar-nav-item navbar-nav-item-flex">
                        <NavLink className="text-dark" to="/contact"><Button onClick={this.closeNavbar} className="text-light"><FormattedMessage id="contact" defaultMessage={'Kapcsolat'}/></Button></NavLink>
                      </NavItem>
                    </> }
                  </ul>
                </Collapse>
              <Collapse className="d-sm-inline-flex text-light navbar-actions-collapse" isOpen={!this.state.collapsed} navbar>
                <ul className="navbar-nav flex-grow navbar-actions">
                  <div className="menu-phone"><LivingText livingTextType={LivingTextTypeEnum.PhoneNumber}></LivingText></div> 
                  <NavbarBrand className="navbar-nav-item-flex menu-facebook" href="https://www.facebook.com/voicebeatobuda" target="_blank">
                    <Button className="text-light nav-item-action-button"><FontAwesomeIcon icon={faFacebookSquare} /></Button>
                  </NavbarBrand>
                  { this.state.currentUser.token !== "" && !this.state.admin && 
                    <NavItem className="navbar-nav-item-flex"><NavLink exact className="text-dark navbar-nav-item-flex" to="/profil"><Button onClick={this.closeNavbar} className="text-light nav-item-action-button"><FontAwesomeIcon icon={faUser} /></Button></NavLink></NavItem> }
                  <div className="nav-item-language-selector" ><LanguageSelector locale={this.state.locale} changeLanguage={this.props.changeLanguage} setServiceValue={true}></LanguageSelector></div>
                  { this.state.currentUser.token !== "" && !this.state.admin         
                    ? <NavItem className="navbar-nav-item-flex"><NavLink exact className="text-dark navbar-nav-item-flex" to="/"><Button className="text-light nav-item-action-button" onClick={this.logout}><FontAwesomeIcon icon={faSignOutAlt} /></Button></NavLink></NavItem>
                    : <NavItem className="navbar-nav-item-flex"><LoginDialog closeNavbar={this.closeNavbar} /> </NavItem>}
                </ul>
              </Collapse>
          </Navbar>
        </div>
      </header>
    );
  }
}
