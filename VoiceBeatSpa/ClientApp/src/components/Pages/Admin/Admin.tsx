import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { faSignOutAlt, faUsers, faKeyboard, faCalendar, faFile, faBars, faChartArea, faEnvelopeOpen  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthenticationService } from '../../../services/authentication.service';
import Reservation from '../Reservation/Reservation';

import './admin.css';
import Users from './Users/Users';
import EditText from './EditText/EditText';
import Image from './Image/Image';
import Charts from './Charts/Charts';

export interface IState {
  mobileOpen : boolean, 
  activeItem : 'reservation' | 'text' | 'image' | 'user' | 'chart' | 'newletter'
}


export default class Admin extends React.Component<any, IState>{
  public state: IState = {
    mobileOpen : false, 
    activeItem: 'reservation'
  };
  
  authenticationService: AuthenticationService = new AuthenticationService();

  constructor(props: any) {
    super(props);
    
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.setActive = this.setActive.bind(this);
    this.renderActive = this.renderActive.bind(this);
  }

  handleDrawerToggle() {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  setActive(active: any) {
    this.setState({activeItem: active});
  }

  renderActive() {
    switch(this.state.activeItem) {
      case 'reservation':
        return <Reservation></Reservation>;
      case 'user':
        return <Users></Users>;
      case 'text':
        return <EditText></EditText>;
      case 'newletter':
        return <div>Hirlevele</div>;
      case 'image':
        return <Image></Image>;
      case 'chart':
        return <Charts></Charts>;
      default:
        return <Reservation></Reservation>;
    }
  }
  public render() {
    const drawer = (
      <div className="admin-nav">
        <div/>
        <Divider />
          <ListItem button key="adminReservationK" onClick={() => this.setActive('reservation')}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faCalendar} />
            </ListItemIcon>
            <ListItemText primary="Foglalás" />
          </ListItem>
        <Divider />
        <Divider />
          <ListItem button key="adminLivingTextK" onClick={() => this.setActive('text')}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faKeyboard} />
            </ListItemIcon>
            <ListItemText primary="Szövegek" />
          </ListItem>
          <ListItem button key="adminNewsletterK" onClick={() => this.setActive('newletter')}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faEnvelopeOpen} />
            </ListItemIcon>
            <ListItemText primary="Hírlevél" />
          </ListItem>
          <ListItem button key="adminPicturesK" onClick={() => this.setActive('image')}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faFile} />
            </ListItemIcon>
            <ListItemText primary="Képek" />
          </ListItem>
          <ListItem button key="adminUsersK" onClick={() => this.setActive('user')}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faUsers} />
            </ListItemIcon>
            <ListItemText primary="Felhasználók" />
          </ListItem>
        <Divider />
          <ListItem button key="adminGraphsK" onClick={() => this.setActive('chart')}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faChartArea} />
            </ListItemIcon>
            <ListItemText primary="Statisztikák" />
          </ListItem>
        <Divider />
          <ListItem button key="adminLogoutK" onClick={() => this.authenticationService.instance().logout()}>
            <ListItemIcon>
              <FontAwesomeIcon className="login-brand-icon" icon={faSignOutAlt} />
            </ListItemIcon>
            <ListItemText primary="Kijelentkezés" />
          </ListItem>
      </div>
    );

    return (
      <div className="admin-container" style={{display: 'flex'}}>
      <CssBaseline />
      <AppBar className="admin-appbar-header" position="fixed">
        <Toolbar>
          <IconButton
            className="admin-header-icon"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={this.handleDrawerToggle}
          >
          <FontAwesomeIcon className="login-brand-icon" icon={faBars} />
          </IconButton>
          <Typography variant="h6" noWrap>
            Adminisztráció
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className="admin-nav">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className="admin-content">
        <div className="admin-content-placeholder"></div>
        <div>
          { this.renderActive() }
        </div>
      </main> 
      </div>
      );
  }
}