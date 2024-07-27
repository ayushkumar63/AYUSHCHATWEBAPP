import './App.css';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline } from '@mui/material';
import * as React from 'react';  
import SvgIcon from '@mui/material/SvgIcon';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import { brown, orange, pink, purple, red, yellow } from '@mui/material/colors';
import { auth, googleProvider } from "./config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';
import { Logout, Settings } from '@mui/icons-material';
import { LoginPage } from './LoginPage'; 
import ReactDOM from 'react-dom/client';
import { db } from './config/firebase';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { getDocs, doc, collection, addDoc, setDoc } from 'firebase/firestore';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

export function Images() {
    const [anchorE1, setAnchorE1] = React.useState(null);
    const open = Boolean(anchorE1);
    const handleClick = (event) => {
        setAnchorE1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorE1(null);
    };

    const navigate = useNavigate();

    const goToPage = (path) => {
        navigate(path);
    }

    const openHomePage = () => {
        goToPage('/Home');
    }

    const logOut = async () => {
        try {
            await signOut(auth);
            goToPage('/Login');
        } catch(err) {
            console.log(err);
        }
    };

    const openProfilePage = () => {
        goToPage('/Profile');
    };

    return(
        <>
        <AppBar position='relative'>
            <Toolbar>
                <IconButton
                    onClick={handleClick}
                    aria-controls={open ? 'menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 60, height: 60}}>Menu</Avatar>
                </IconButton>
                <Menu
                    anchorE1={anchorE1}
                    open={open}
                    id="menu"
                    onClick={handleClose}
                    onClose={handleClose}
                >
                    <MenuItem onClick={openProfilePage}>
                        <Avatar /> Profile
                    </MenuItem>
                    <MenuItem onClick={openHomePage}>
                        <OtherHousesIcon /> Home Page
                    </MenuItem>
                    <MenuItem>
                        <Settings /> Settings
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Logout /> Sign Out
                    </MenuItem>
                </Menu>
                <HomeIcon sx={{ color: yellow[500], fontSize: 40}} />
                <Typography variant='h6'>Images</Typography>
            </Toolbar>
        </AppBar>
        <Routes>
           <Route path="/" element={
                <>
                    <div className='Images'>
                        <br />
                        <Typography variant='h4'>Images</Typography>
                    </div>
                </>
           } /> 
           <Route path='/Home' element={<HomePage />} />
           <Route path='/Login' element={<LoginPage />} />
           <Route path='/Profile' element={<ProfilePage />} />
        </Routes>
        </>
    );
}

export default Images;