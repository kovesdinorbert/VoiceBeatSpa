import React, { Component, RefObject } from 'react';
import { Container } from 'reactstrap';
 import { NavMenu } from './NavMenu';
 import { AuthenticationService } from '../services/authentication.service';
 import Admin from './Pages/Admin/Admin';
 import Footer from './Pages/Footer/Footer';
 import Toastr from './Common/Toastr/Toastr';

export class Layout extends Component {
  static displayName = Layout.name;
  toastrRef;
  
  authenticationService = new AuthenticationService();
  
  constructor (props) {
    super(props);

    this.state = {
      token: ""
    };
    this.toastrRef = React.createRef();
  }

  componentDidMount() {
    this.authenticationService.instance().currentUser.subscribe(val => 
      {this.setState({token: val.token});if (val.token !== "") {
        this.toastrRef.current?.openSnackbar("message.success.login", "success")}});
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
            <Toastr ref={this.toastrRef}></Toastr>
            <Footer></Footer>
          </>}
      </div>
    );
  }
}
