import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ServicesMenuOpen({closeNavbar}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    closeNavbar();
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="services-menu" className="text-light" aria-haspopup="true" onClick={handleClick}>
        <FormattedMessage id="services" defaultMessage={'Szolgáltatások'}/>  <FontAwesomeIcon className="" icon={faCaretDown} style={{marginLeft:"5px"}} />
      </Button>
      <Menu
        id="services-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="services-menu-container"
      >
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/services/rooms"><FormattedMessage id="services.rooms" defaultMessage={'Próbatermek'}/></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/services/rent"><FormattedMessage id="services.rent" defaultMessage={'Bérlés'}/></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/services/events"><FormattedMessage id="services.events" defaultMessage={'Rendezvényszervezés'}/></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/services/studio"><FormattedMessage id="services.studio" defaultMessage={'Stúdió'}/></NavLink></MenuItem>
      </Menu>
    </div>
  );
}