import './App.css';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline } from '@mui/material';
import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { brown, orange, pink, purple, red, yellow } from '@mui/material/colors';
import { auth, googleProvider } from "./config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { HomePage } from './HomePage';
import { ProfilePage } from './ProfilePage';
import { LoginPage } from './LoginPage'; 
import ReactDOM from 'react-dom/client';
import { db } from './config/firebase';
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

const root = ReactDOM.createRoot(document.getElementById('root'));

function openHomePage() {
  //root.unmount();
  return(
    root.render(
      <React.StrictMode>
        <HomePage />
      </React.StrictMode>
    )
  )
}

function openLoginPage() {
  //root.unmount();
  return(
    root.render(
      <React.StrictMode>
        <LoginPage />
      </React.StrictMode>
    )
  )
};

export function App() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  //const [gender, setGender] = React.useState("");
  const [notifyBool, setNotifyBool] = React.useState(false);

  const userDetailsRef = collection(db, 'userDetails');

  const navigate = useNavigate();

  const goToPath = (path) => {
    navigate(path);
  }

  const createAccount = async () => {
    const data = {
        Name: name,
        Email: email,
        Password: password,
        ReceiveNotificationsOn: notifyBool,
        numberOfPosts: 0,
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      try {
        await setDoc(doc(db, "userDetails", email), data);
      } catch(err) {
        console.log(err);
      }
      goToPath('/Home');
      //openHomePage();
    } catch(err) {
      console.log(err);
    }
  }

  const signInWithGooglePopup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      //openHomePage();
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="App">
      <Routes>
          <Route path="/" element={
            <>
        <AppBar position="relative">
        <Toolbar>
        <HomeIcon sx={{ fontSize: 40, color: yellow[500] }} />
          <Typography className="TypographyHeading" variant="h6">
            AyushChat
          </Typography>
        </Toolbar>
      </AppBar>
      <br />
      <div className='App1'>
      <Typography variant="h4" align="left">
        Create Account
      </Typography>
      <br />
      <Typography variant="body1" align="left" paragraph>
        Please create a new account if you don't already have one, else click on login.
        You can also login through Google.
      </Typography>
      <FormGroup className = "genderForm">
        <br />
        <TextField onChange={(e) => setName(e.target.value)} className="TextInput" label="Name" variant="outlined" />
        <br />
        <TextField onChange={(e) => setEmail(e.target.value)} className="TextInput" label="Email" variant="outlined" />
        <br />
        <TextField onChange={(e) => setPassword(e.target.value)} className="TextInput" label="Password" type="password" variant="outlined" />
        <FormControlLabel /*onClick={setGender('Male')}*/ control = {<Checkbox color="secondary" />} label = "Male" />
        <FormControlLabel /*onClick={setGender('Female')}*/ control = {<Checkbox color="success"/>} label = "Female" />
        <FormControlLabel /*onClick={setGender('Transgender')}*/ control = {<Checkbox color="default"/>} label = "Transgender" />
        <FormControlLabel checked = {notifyBool} onChange={(e) => setNotifyBool(e.target.checked)} control = {<Switch />} className='switchText' label="Want to receive email notifications from AyushChat?" />
      </FormGroup>
      <br />
      <br />
      <Button onClick={ createAccount } className='Button' variant="contained">Submit</Button>
      <br />
      <br />
      <Link to="/Login">
      <Button /* onClick={ openLoginPage } */ className='Button' color='secondary' variant="contained">Login</Button>
      </Link>
      <br />
      <br />
      <Button onClick={ signInWithGooglePopup } className='Button' variant='contained' color='success'>Sign In With Google</Button>        
      </div>
      </>
          } />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;