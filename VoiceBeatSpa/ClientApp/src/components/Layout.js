import React, { Component } from 'react';
import { Container } from 'reactstrap';
 import { NavMenu } from './NavMenu';
 import { AuthenticationService } from '../services/authentication.service';
 import Admin from './Pages/Admin/Admin';

export class Layout extends Component {
  static displayName = Layout.name;
  
  authenticationService = new AuthenticationService();
  
  constructor (props) {
    super(props);

    this.state = {
      token: ""
    };
  }

  componentDidMount() {
    this.authenticationService.instance().currentUser.subscribe(val => 
      {this.setState({token: val.token})});
  }

  render () {
    var admin = this.state.token != "" && this.authenticationService.instance().isAdmin(this.state.token);

    return (
      <div>
        {admin 
        ? <Admin></Admin>
        : <> 
            <NavMenu changeLanguage={this.props.changeLanguage} currentLocale={this.props.currentLocale} />
            <Container className="content-container">
              {this.props.children}
            </Container>
          </>}
      </div>
    );
  }
}
