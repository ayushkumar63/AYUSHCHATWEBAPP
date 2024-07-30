import './App.css';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline, CardHeader } from '@mui/material';
import * as React from 'react';  
import SvgIcon from '@mui/material/SvgIcon';
import { storage } from './config/firebase';
import { AyushBot } from './AyushBot';
import { Card, CardMedia, CardContent } from '@mui/material';
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
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

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

    const openAyushBot = () => {
        navigate('/AyushBot');
    };

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
            const number1 = number + 1;
            const url = await getDownloadURL(ref(storage, "ImagePosts/ImagePost" + number + ".png"));
            const imagePostDetailsRef = doc(db, "imagePostDetails", "ImagePost" + number1);
            await setDoc(imagePostDetailsRef, {
                FileName: "ImagePost" + number1,
                Name: filteredData.Name,
                Email: filteredData.Email,
                ImagePostURL: url,
                NumLikes: 0,
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

    const doLike = async (fileName) => {
        try {

        } catch(err) {
            
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
        <AppBar sx={{ maxWidth: 4500 }} position='relative'>
            <Toolbar>
                <HomeIcon sx={{ color: yellow[500], fontSize: 40}} />
                <Typography variant='h6'>Images</Typography>
                    <MenuItem onClick={openProfilePage}>
                        <Avatar /> Profile
                    </MenuItem>
                    <MenuItem>
                        About AyushChat
                    </MenuItem>
                    <MenuItem>
                        <Settings /> Settings
                    </MenuItem>
                    <MenuItem onClick={openHomePage}>
                        <OtherHousesIcon /> Home Page
                    </MenuItem>
                    <MenuItem onClick={openAyushBot}>
                        AyushBot   
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <Logout /> Sign Out
                    </MenuItem>
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
                                <Card sx={{maxWidth: 345}}>
                                    <CardHeader 
                                        title={singleDoc.data().Name}
                                    />
                                    <CardMedia 
                                        component="img"
                                        image={singleDoc.data().ImagePostURL}
                                        width="275"
                                        height="250"
                                    />
                                    <CardContent>
                                        <ThumbUpAltIcon />
                                        <b><p>Likes: </p></b><p>{singleDoc.data().NumLikes}</p>
                                    </CardContent>
                                </Card>
                                <hr />
                                <br />
                            </div>
                        ))}
                    </div>
                </>
           } /> 
           <Route path='/Home' element={<HomePage />} />
           <Route path='/Login' element={<LoginPage />} />
           <Route path='/Profile' element={<ProfilePage />} />
           <Route path='/AyushBot' element={<AyushBot />} />
        </Routes>
        </>
    );
}

export default Images;