import * as React from 'react';
import './App.css';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import SvgIcon from '@mui/material/SvgIcon';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline } from '@mui/material';
import { brown, orange, pink, purple, red, yellow } from '@mui/material/colors';
import ReactDOM from 'react-dom/client';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Logout, Settings } from '@mui/icons-material';
import { db, storage } from './config/firebase';
import { getDocs, doc, getDoc, collection, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ProfilePage } from './ProfilePage';
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';
import { App } from './App';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { BrowserRouter as Router, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { Switch as RouterSwitch } from "react-router-dom";
import LoginPage from './LoginPage';
import { Images } from './Images';
import { HomePage } from './HomePage';
import { Card, CardMedia, CardHeader, CardContent } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export function AyushBot() {
    const [query, setQuery] = React.useState("");
    const [reply, setReply] = React.useState("");
    const genAI = new GoogleGenerativeAI("AIzaSyBwNZ6OZtChNEclvjc464GAqi6TtQBRHqE");
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const chat = model.startChat({ history: [] });

    const generateReply = async () => {
        try {
            const prompt = query;
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            const text = response.text();
            setReply(text);
            const area = document.getElementById('replyWholeArea');
            area.style.display = 'flex';
        } catch(err) {
            console.log(err);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            navigate('/Login');
        } catch(err) {  
            console.log(err);
        }
    };

    function HomeIcon(props) {
        return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
        );
    }

    const navigate = useNavigate();

    const openHomePage = () => {
        navigate('/Home');
    };

    const openProfilePage = () => {
        navigate('/Profile');
    };

    const openImages = () => {
        navigate('/Images');
    };

    return(
        <>
        <AppBar sx={{ maxWidth: 4500 }} position='relative'>
            <Toolbar>
            <HomeIcon sx={{ fontSize: 40, color: yellow[500] }} />
            <Typography variant='h6'>AyushBot</Typography>
            <MenuItem onClick={openProfilePage}>
                        <Avatar /> Profile
                    </MenuItem>
                    <MenuItem>
                        About AyushChat
                    </MenuItem>
                    <MenuItem onClick={openHomePage}>
                       <OtherHousesIcon /> Home Page
                    </MenuItem>
                    <MenuItem>
                        <Settings /> Settings
                    </MenuItem>
                    <MenuItem onClick={openImages}>
                        <ImageIcon />Images
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Logout /> Sign Out
                    </MenuItem>
            </Toolbar>
        </AppBar>
        <br />
            <Routes>
                <Route path='/' element={
                    <>
                        <div className='AyushBot'>
                            <Typography variant='h4' color={"white"}>This is AyushBot (Created using Gemini API)</Typography>
                            <br />
                            <TextField onChange={(e) => setQuery(e.target.value)} className='AyushBotTextInput' label='Ask me anything....' variant='outlined' />
                            <Button onClick={generateReply} className='AskButton' variant='contained' color='secondary'>Ask</Button>
                            <br />
                            <br />
                            <Typography variant='h5' sx={{ fontSize: 30 }} color={"yellow"}><b>Reply</b></Typography>
                            <br />
                            <div id='replyWholeArea' className='replyWholeArea'>
                                <SmartToyIcon sx={{ fontSize: 40, color: "#62f524" }} />
                                <Card sx={{ backgroundColor: "#FFD580", maxWidth: 750, marginLeft: "15px"}}>
                                    <cardContent>
                                        <div className='replyArea'>
                                            <Typography variant='h6'>{reply}</Typography>
                                        </div>
                                    </cardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                } />
                <Route path='/Home' element={<HomePage />} />
                <Route path='/Images' element={<Images />} />
                <Route path='/Login' element={<LoginPage />} />
                <Route path='/Profile' element={<ProfilePage />} />
            </Routes>
        </>
    );
};

export default AyushBot;