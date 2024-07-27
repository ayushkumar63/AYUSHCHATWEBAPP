import * as React from 'react';
import { auth } from './config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './App.css';
import SvgIcon from '@mui/material/SvgIcon';
import { AppBar, Typography, Toolbar, ImageList, ImageListItem, Switch, Button, Rating, Checkbox, FormControlLabel, FormGroup, TextField, CssBaseline } from '@mui/material';
import { brown, orange, pink, purple, red, yellow } from '@mui/material/colors';
import ReactDOM from 'react-dom/client';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Logout, Settings } from '@mui/icons-material';
import { HomePage } from './HomePage';

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
};

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
}

export function LoginPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const Login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            openHomePage();
        } catch(err) {
            console.log(err);
        }
    };

    return(
        <>
        <AppBar position='relative'>
            <Toolbar>
                <HomeIcon sx={{ fontSize: 40, color: yellow[500] }} />
                <Typography variant='h5'>Login</Typography>
            </Toolbar>
        </AppBar>
        <br />
        <div className='LoginPage'>
            <Typography variant='h4' align='left'>Login</Typography>
            <Typography variant='body1' align='left' paragraph>Please login to your existing account.</Typography>
            <FormGroup className='LoginForm'>
                <br />
                <TextField onChange={(e) => setEmail(e.target.value)} className='TextInput' variant='outlined' label='Email' />
                <br />
                <br />
                <TextField type='password' onChange={(e) => setPassword(e.target.value)} className='TextInput' variant='outlined' label='Password' />
            </FormGroup>
            <br />
            <br />
            <Button onClick={ Login } className='Button' variant='contained'>Login</Button>
        </div>
        </>
    );
}

export default LoginPage;