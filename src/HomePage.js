import * as React from 'react';
import './App.css';
import SvgIcon from '@mui/material/SvgIcon';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline } from '@mui/material';
import { brown, orange, pink, purple, red, yellow } from '@mui/material/colors';
import ReactDOM from 'react-dom/client';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Menu from '@mui/material/Menu';
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

const root = ReactDOM.createRoot(document.getElementById('root'));

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

export function HomePage() {
    const [anchorE1, setAnchorE1] = React.useState(null);
    const open = Boolean(anchorE1);
    const [numPosts, setNumPosts] = React.useState(0);
    const [thePosts, setThePosts] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState(null);
    
    const navigate = useNavigate();

    if (!auth.currentUser) {
        navigate('/Login');
    } 

    const email = auth.currentUser.email;
    
    const [post, setPost] = React.useState("");
    const postsRef = collection(db, 'Posts');
    const userDetailsDocRef = doc(db, 'userDetails', email);


    const handleClick = (event) => {
        setAnchorE1(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorE1(null);
    };

    const openProfilePage = () => {
        navigate('/Profile');
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            console.log("Successfully logged out.")
            navigate('/Login');
            //openApp();
        } catch(err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        try {
            const getPosts = async () => {
                try {
                    const posts = await getDocs(postsRef);
                    setThePosts(posts.docs.sort().reverse());         
                    /*const filteredData = posts.docs.map((doc) => {
                        console.log(doc.data());
                    })*/
                } catch(err) {
                    console.log(err);
                }
            };
            getPosts();        
        } catch(err) {
            console.log(err);
        };
    }, []);

    const openImages = () => {
        navigate("/Images");
    }

    const uploadPost = async () => {
        try {
            const details = await getDoc(userDetailsDocRef);
            const filteredData = details.data();
            setNumPosts(filteredData.numberOfPosts);
            await updateDoc(userDetailsDocRef, {
                numberOfPosts: filteredData.numberOfPosts + 1,
            });
            const numPostsRef = doc(db, "OtherDocuments", "numPosts");
            const numPostsDoc = await getDoc(numPostsRef);
            const numPosts = numPostsDoc.data().Number;
            try {
                const profileURL = await getDownloadURL(ref(storage, 'ProfilePicture/' + filteredData.Email + '/profilepicture.png'));
                const newNumber = numPosts + 1;
                /*await addDoc(postsRef, {
                    Name: filteredData.Name,
                    Email: filteredData.Email,
                    Post: post,
                    ProfileURL: profileURL,
                });*/
                await setDoc(doc(db, "Posts", "Post" + newNumber), {
                    Name: filteredData.Name,
                    Email: filteredData.Email,
                    Post: post,
                    ProfileURL: profileURL,
                });
                await updateDoc(numPostsRef, {
                    Number: numPosts + 1,
                });
            } catch(err) {
                const filesFolderRef = ref(storage, 'ProfilePicture/' + email + '/profilepicture.png');
                const fileUploadDefault = './config/DefaultProfilePicture.png';
                await uploadBytes(filesFolderRef, fileUploadDefault);
                const profileURL = await getDownloadURL(ref(storage, 'ProfilePicture/' + email + '/profilepicture.png'));
                const newNumber = numPosts + 1;
                /*await addDoc(postsRef, {
                    Name: filteredData.Name,
                    Email: filteredData.Email,
                    Post: post,
                    ProfileURL: profileURL,
                });*/
                await setDoc(doc(db, "Posts", "Post" + newNumber), {
                    Name: filteredData.Name,
                    Email: filteredData.Email,
                    Post: post,
                    ProfileURL: profileURL,
                });
                await updateDoc(numPostsRef, {
                    Number: numPosts + 1,
                });
                console.log(err);
            }
    
            console.log("Posted Successfully");
            const getPosts = async () => {
                try {
                    const posts = await getDocs(postsRef);
                    setThePosts(posts.docs.sort().reverse());         
                    /*const filteredData = posts.docs.map((doc) => {
                        console.log(doc.data());
                    })*/
                } catch(err) {
                    console.log(err);
                }
            }
            getPosts();        
        } catch(err) {
            console.log(err);
        }
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
                    <Avatar sx={{ width: 60, height: 60 }}>Menu</Avatar>
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
                    <MenuItem>
                        About AyushChat
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
                </Menu>
                <HomeIcon sx={{ fontSize: 40, color: yellow[500] }} />
                <Typography variant='h6'>Home Page</Typography>
            </Toolbar>
        </AppBar>
        <br />
        <Routes>
            <Route path="/" element={
                <>
                <div className='HomePage'>
            <Typography variant='h5'>Welcome to AyushChat! This is Home Page.</Typography>
            <br />
            <Typography variant='h6'>Want to write a new post?</Typography>
            <br />
            <TextField onChange={(e) => setPost(e.target.value)} className='PostField' variant='outlined' label='New Post' multiline />
            <br />
            <br />
            <Button onClick={(uploadPost)} className='Button' variant='contained' color='secondary'>Post</Button>
            <br />
            <br />
            <Typography variant='h4'>Posts</Typography>
            <br />
            {thePosts.map((doc) => (
                <div>
                    <img className='ProfilePictureImage' src={doc.data().ProfileURL} />
                    <Typography variant='h6'><b>{doc.data().Name}</b>: {doc.data().Post}</Typography>
                    <hr />
                </div>
            ))}
        </div>
                </>
            } />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/Images" element={<Images />} />
        </Routes>
        </>
    );
}

export default HomePage;