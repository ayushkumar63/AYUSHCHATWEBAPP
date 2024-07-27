import './App.css';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline } from '@mui/material';
import * as React from 'react';  
import SvgIcon from '@mui/material/SvgIcon';
import { storage } from './config/firebase';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import { brown, orange, pink, purple, red, yellow } from '@mui/material/colors';
import { auth, googleProvider } from "./config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';
import { FileUpload, Logout, Settings } from '@mui/icons-material';
import { LoginPage } from './LoginPage'; 
import ReactDOM from 'react-dom/client';
import { db } from './config/firebase';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import { getDocs, doc, getDoc, collection, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

export function Images() {
    const [anchorE1, setAnchorE1] = React.useState(null);
    const [uploadFile, setUploadFile] = React.useState(null);
    const [theImagePostDetails, setTheImagePostDetails] = React.useState([]);
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

    const email = auth.currentUser.email;
    const numImagePostsRef = doc(db, "OtherDocuments", "numImagePosts");

    const uploadImage = async () => {
        if (!FileUpload) return;
        const numImagePostsRefDoc = await getDoc(numImagePostsRef);
        const number = numImagePostsRefDoc.data().Number;
        const imagePostsRef = ref(storage, "ImagePosts/ImagePost" + number + ".png");
        try {
            await uploadBytes(imagePostsRef, uploadFile);
            await updateDoc(numImagePostsRef, {
                Number: number + 1,
            });
            const userDetailsRef = doc(db, "userDetails", email);
            const userDetaisDoc = await getDoc(userDetailsRef);
            const filteredData = userDetaisDoc.data();
            const url = await getDownloadURL(ref(storage, "ImagePosts/ImagePost" + number + ".png"));
            const imagePostDetailsRef = collection(db, "imagePostDetails");
            await addDoc(imagePostDetailsRef, {
                Name: filteredData.Name,
                Email: filteredData.Email,
                ImagePostURL: url,
            });
            const getImagePostDetails = async () => {
                try {
                    const docsRef = collection(db, "imagePostDetails");
                    const docs = await getDocs(docsRef);
                    setTheImagePostDetails(docs.docs);
                } catch(err) {
                    console.log(err);
                }
            };
            getImagePostDetails();
        } catch(err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        const getImagePostDetails = async () => {
            try {
                const docsRef = collection(db, "imagePostDetails");
                const docs = await getDocs(docsRef);
                setTheImagePostDetails(docs.docs);
            } catch(err) {
                console.log(err);
            }
        };
        getImagePostDetails();
    }, []);

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
                        <br />
                        <input onChange={(e) => setUploadFile(e.target.files[0])} type='file' />
                        <br />
                        <br />
                        <Button onClick={uploadImage} className='Button' variant='contained' color='success'>Post an Image</Button>
                        <br />
                        <br />
                        <Typography variant='h5'>Everybody's Posts Till Now</Typography>
                        <br />
                        {theImagePostDetails.map((singleDoc) => (
                            <div>
                                <Typography variant='h6'>Name: {singleDoc.data().Name}</Typography>
                                <br />
                                <img className='PostImage' src={singleDoc.data().ImagePostURL} />
                                <hr />
                            </div>
                        ))}
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