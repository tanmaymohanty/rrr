import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import './Header.css';
import logo from '../../assets/images/logo.png';
import profile from '../../assets/images/profile.jpeg'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/userActions';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('employee');
    dispatch(logoutUser());
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="static" className="custom-header">
      <Toolbar className="header-toolbar">
        <Typography variant="h6" className="white-text">
          <div className="img2">
            <img src={logo} alt="logo" />
          </div>
        </Typography>
        <div>
          <Typography variant="body1" className="white-text" style={{ marginRight: '16px', display: 'inline-block' }}>
            Welcome, {user.username}!
          </Typography>
          <IconButton onClick={handleClick} className="icon-button">
            <div className="img3">
              <img src={profile} alt="logo" />
            </div>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem className="menu-item">
              <EmailIcon style={{ marginRight: '10px' }} />
              {user.email}
            </MenuItem>
            <MenuItem className="menu-item">
              <PhoneIcon style={{ marginRight: '10px' }} />
              {user.phone}
            </MenuItem>
            <MenuItem className="menu-item" onClick={handleLogout}>
              <ExitToAppIcon style={{ marginRight: '10px' }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;