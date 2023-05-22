// IMPORTING APIS
import React from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    useMediaQuery,
    Button,
    useScrollTrigger,
    Slide,
    Menu,
    MenuItem,
    ListItemIcon
} from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "./Navbar.css"

// IMPORTING ICONS
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import SchoolIcon from "@material-ui/icons/School";
import PersonIcon from "@material-ui/icons/Person";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");


// REACT APP IMPORTS
 

// LOCAL-STYLING
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

function HideOnScroll(props:any) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction={"down"} in={!trigger}>
            {children}
        </Slide>
    );
}

const Navigation = (props:any) => {
    const classes = useStyles();
    const [anchor, setAnchor] = React.useState(null);
    const open = Boolean(anchor);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleMenu = (event:any) => {
        setAnchor(event.currentTarget);
    };
    return (
        <div className={classes.root}>
            <HideOnScroll {...props}>
                 
                    <AppBar style={{backgroundColor: "lightskyblue", position: "absolute", marginBottom: "20vh"}}>
                    <Toolbar style={{color: "white"}}>
                        <i
                            className="fa-solid fa-fingerprint"
                            style={{ color: "black", paddingRight: "15px", fontSize: "25px" }}
                        ></i> {' '}
                        <Typography
                            style={{color: "black"}}
                                variant="h5"
                                component="p"
                                className={classes.title}
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
                                            vertical: "top",
                                            horizontal: "right"
                                        }}
                                        // KeepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right"
                                        }}
                                        open={open}
                                    >
                                        <MenuItem
                                            onClick={() => setAnchor(null)}
                                            component={Link}
                                            to="/"
                                        >
                                            <ListItemIcon>
                                            <i
                                                className="fa-solid fa-house"
                                                style={{ color: "black", paddingRight: "15px" }}
                                            ></i> {' '}
                                        </ListItemIcon>
                                         
                                            <Typography variant="h6"> Home</Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => setAnchor(null)}
                                            component={Link}
                                        to="/ViewIdentity"
                                        >
                                            <ListItemIcon>
                                            <i
                                                className="fas fa-fingerprint"
                                                style={{ color: "black", paddingRight: "10px" }}
                                            ></i>
                                            </ListItemIcon>
                                        <Typography variant="h6"> ViewIdentity </Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => setAnchor(null)}
                                            component={Link}
                                        to="/blog"
                                        >
                                            <ListItemIcon>
                                            <i
                                                className="fa-solid fa-pen"
                                                style={{ color: "black", paddingRight: "10px" }}
                                            ></i> 
                                            </ListItemIcon>
                                        <Typography variant="h6">  blog</Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => setAnchor(null)}
                                            component={Link}
                                        to="/design"
                                        >
                                            <ListItemIcon>
                                            <i
                                                className="fas fa-drafting-compass"
                                                style={{ color: "black", paddingRight: "10px" }}
                                            ></i>
                                            </ListItemIcon>
                                        <Typography variant="h6">Design </Typography>
                                            
                                        
                                    </MenuItem>
                                    <MenuItem>
                                        <ListItemIcon>
                                            <WalletMultiButton
                                                style={{
                                                    fontFamily: "Roboto Mono,monospace",
                                                    fontWeight: "bold",
                                                    fontSize: "18px",
                                                    backgroundColor: "white",

                                                    color: "lightskyblue",
                                                }}
                                            />
                                        </ListItemIcon>
                                    </MenuItem>
                                </Menu>
                                
                                </>
                            ) : (
                                <div style={{ marginRight: "2rem", display: "flex", flexDirection: "row", justifyContent: "space-around", width: "65vw" }}>
                                    <Button
                                        variant="text"
                                        component={Link}
                                        to="/"
                                        color="default"
                                    > <i
                                            className="fa-solid fa-house"
                                        style={{ color: "black", paddingRight: "10px" }}
                                    ></i>  
                                         
                                        Home
                                    </Button>
                                    <Button
                                        variant="text"
                                        component={Link}
                                        to="/ViewIdentity"
                                        color="default"
                                    ><i
                                            className="fas fa-fingerprint"
                                        style={{ color: "black", paddingRight: "10px" }}
                                    ></i>  
                                         
                                        View Identity
                                    </Button>
                                    <Button
                                        variant="text"
                                        component={Link}
                                        to="/blog"
                                        color="default"
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
                                        color="default"
                                    >
                                        <i
                                            className="fas fa-drafting-compass"
                                            style={{ color: "black", paddingRight: "10px" }}
                                        ></i>
                                        Design
                                    </Button>
                                    <WalletMultiButton
                                        style={{
                                            fontFamily: "Roboto Mono,monospace",
                                            fontWeight: "bold",
                                            fontSize: "18px",
                                            backgroundColor: "white",

                                            color: "lightskyblue",
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
