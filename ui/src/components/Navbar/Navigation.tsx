// IMPORTING APIS
import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    useMediaQuery,
    Button,
    useScrollTrigger,
    Slide,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@material-ui/core';
import { Typography } from '@mui/material';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { BrowserRouter, Route, Link } from 'react-router-dom';

// IMPORTING ICONS
import MenuIcon from '@material-ui/icons/Menu';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './Navbar.css';
require('@solana/wallet-adapter-react-ui/styles.css');

// REACT APP IMPORTS

// LOCAL-STYLING
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function HideOnScroll(props: any) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction={'down'} in={!trigger}>
            {children}
        </Slide>
    );
}

const Navigation = (props: any) => {
    const classes = useStyles();
    const [anchor, setAnchor] = React.useState(null);
    const open = Boolean(anchor);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleMenu = (event: any) => {
        setAnchor(event.currentTarget);
    };
    return (
        <div className={classes.root} id="navbar">
            <HideOnScroll {...props}>
                <AppBar style={{ backgroundColor: 'lightskyblue', position: 'absolute', marginBottom: '20vh' }}>
                    <Toolbar>
                        <i className="fa-solid fa-fingerprint" style={{ color: 'black', paddingRight: '15px' }}></i>{' '}
                        <Typography
                            style={{ color: 'black' }}
                            variant="h5"
                            component="p"
                            className={classes.title}
                            fontWeight={'600'}
                            fontFamily={'Roboto Mono,monospace'}
                        >
                            Proof-of-Identity
                        </Typography>
                        {isMobile ? (
                            <>
                                <IconButton
                                    // color="textPrimary"
                                    className={classes.menuButton}
                                    edge="start"
                                    aria-label="menu"
                                    onClick={handleMenu}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchor}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    // KeepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                >
                                    <MenuItem
                                        onClick={() => setAnchor(null)}
                                        component={Link}
                                        to="/"
                                        style={{ fontWeight: '700', color: 'black' }}
                                    >
                                        <ListItemIcon>
                                            <i
                                                className="fa-solid fa-house"
                                                style={{ color: 'black', paddingRight: '15px' }}
                                            ></i>{' '}
                                        </ListItemIcon>

                                        <Typography fontWeight={'bold'} fontFamily={'Roboto Mono,monospace'}>
                                            {' '}
                                            Home
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => setAnchor(null)} component={Link} to="/ViewIdentity">
                                        <ListItemIcon>
                                            <i
                                                className="fas fa-fingerprint"
                                                style={{ color: 'black', paddingRight: '10px' }}
                                            ></i>
                                        </ListItemIcon>
                                        <Typography fontWeight={'bold'} fontFamily={'Roboto Mono,monospace'}>
                                            {' '}
                                            ViewIdentity{' '}
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => setAnchor(null)} component={Link} to="/Allusers">
                                        <i
                                            className="fa-solid fa-people-line"
                                            style={{ color: 'black', paddingRight: '10px' }}
                                        ></i>
                                        <Typography fontWeight={'500'} fontFamily={'Roboto Mono,monospace'}>
                                            {' '}
                                            Search Identity
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => setAnchor(null)}
                                        component={Link}
                                        to="/blog"
                                        style={{ fontWeight: '500', color: 'black' }}
                                    >
                                        <ListItemIcon>
                                            <i
                                                className="fa-solid fa-pen"
                                                style={{ color: 'black', paddingRight: '10px' }}
                                            ></i>
                                        </ListItemIcon>
                                        <Typography fontWeight={'bold'} fontFamily={'Roboto Mono,monospace'}>
                                            {' '}
                                            blog
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => setAnchor(null)}
                                        component={Link}
                                        to="/design"
                                        style={{ fontWeight: '500', color: 'black' }}
                                    >
                                        <ListItemIcon>
                                            <i
                                                className="fas fa-drafting-compass"
                                                style={{ color: 'black', paddingRight: '10px' }}
                                            ></i>
                                        </ListItemIcon>
                                        <Typography fontWeight={'bold'} fontFamily={'Roboto Mono,monospace'}>
                                            Design{' '}
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem>
                                        <ListItemIcon>
                                            <WalletMultiButton
                                                style={{
                                                    fontFamily: 'Roboto Mono,monospace',
                                                    fontWeight: 'bold',
                                                    fontSize: '18px',
                                                    backgroundColor: 'white',

                                                    color: 'lightskyblue',
                                                }}
                                            />
                                        </ListItemIcon>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <div
                                style={{
                                    marginRight: '2rem',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    width: '65vw',
                                }}
                            >
                                <Button
                                    variant="text"
                                    component={Link}
                                    to="/"
                                    style={{ fontWeight: '700', color: 'black', fontFamily: 'Roboto Mono,monospace' }}
                                >
                                    {' '}
                                    <i
                                        className="fa-solid fa-house"
                                        style={{ color: 'black', paddingRight: '10px' }}
                                    ></i>
                                    Home
                                </Button>
                                <Button
                                    variant="text"
                                    component={Link}
                                    to="/ViewIdentity"
                                    style={{ fontWeight: '700', color: 'black', fontFamily: 'Roboto Mono,monospace' }}
                                >
                                    <i
                                        className="fa-solid fa-id-card"
                                        style={{ color: 'black', paddingRight: '10px' }}
                                    ></i>
                                    View Identity
                                </Button>
                                <Button
                                    variant="text"
                                    component={Link}
                                    to="/SearchIdentity"
                                    style={{ fontWeight: '700', color: 'black', fontFamily: 'Roboto Mono,monospace' }}
                                >
                                    <i
                                        className="fa-solid fa-search"
                                        style={{ color: 'black', paddingRight: '10px', fontWeight: 'bolder' }}
                                    ></i>
                                    Search Identity
                                </Button>
                                <Button
                                    variant="text"
                                    component={Link}
                                    to="/MyResponses"
                                    style={{ fontWeight: '700', color: 'black', fontFamily: 'Roboto Mono,monospace' }}
                                >
                                    <i
                                        className="fa-solid fa-search"
                                        style={{ color: 'black', paddingRight: '10px', fontWeight: 'bolder' }}
                                    ></i>
                                    Incoming Requests
                                    </Button>
                                    <Button
                                        variant="text"
                                        component={Link}
                                        to="/MyRequests"
                                        style={{ fontWeight: '700', color: 'black', fontFamily: 'Roboto Mono,monospace' }}
                                    >
                                        <i
                                            className="fa-solid fa-search"
                                            style={{ color: 'black', paddingRight: '10px', fontWeight: 'bolder' }}
                                        ></i>
                                        Outgoing Requests
                                    </Button>
                                {/* <Button
                                    variant="text"
                                    component={Link}
                                    to="/blog"

                                    style={{ fontWeight: "700", color: "black", fontFamily: "Roboto Mono,monospace" }}
                                >
                                    <i
                                        className="fa-solid fa-pen"
                                        style={{ color: "black", paddingRight: "10px" }}
                                    ></i>
                                    Blog
                                </Button>
                                <Button
                                    variant="text"
                                    component={Link}
                                    to="/design"

                                    style={{ fontWeight: "700", color: "black", fontFamily: "Roboto Mono,monospace" }}
                                >
                                    <i
                                        className="fas fa-drafting-compass"
                                        style={{ color: "black", paddingRight: "10px" }}
                                    ></i>
                                    Design
                                </Button> */}
                                <WalletMultiButton
                                    style={{
                                        fontFamily: 'Roboto Mono,monospace',
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        backgroundColor: 'white',

                                        color: 'lightskyblue',
                                    }}
                                />
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </div>
    );
};

export default Navigation;
