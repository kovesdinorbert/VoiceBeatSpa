import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default function RoomMenuOpen() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <FormattedMessage id="rooms" defaultMessage={'Termek'}/>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/rooms/red"><FormattedMessage id="roomsRed" defaultMessage={'Piros terem'}/></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/rooms/blue"><FormattedMessage id="roomsBlue" defaultMessage={'Kék terem'}/></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/rooms/gray"><FormattedMessage id="roomsGray" defaultMessage={'Szürke terem'}/></NavLink></MenuItem>
        <MenuItem onClick={handleClose}><NavLink className="text-dark" to="/rooms/studio"><FormattedMessage id="roomsStudio" defaultMessage={'Stúdió'}/></NavLink></MenuItem>
      </Menu>
    </div>
  );
}