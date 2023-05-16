import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
 
import "./Navbar.css";
import { Link } from "react-router-dom";
import { MenuData } from "./MenuData";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Box } from '@mui/material';
import "../../App.css";
import { Nav } from "react-bootstrap";
require("@solana/wallet-adapter-react-ui/styles.css");


export const Navibar = () => {
  return (
    <Navbar bg="light" expand="lg" style={{zIndex: "999"}}>
      <Container>
          <Navbar.Brand href="#home" style={{width: "30vh"}}>
            <i
                className="fa-solid fa-fingerprint"
                style={{ color: "black", paddingRight: "15px" }}
              ></i> {' '}
            Proof-of-Identity
          </Navbar.Brand>
         {/* <div style={{width: "70vw"}}> */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ width: "100vw" }}
            navbarScroll
          >
            {MenuData.map((menu, index) => {
            return (
              <Nav.Link key={index}>
                <Link to={menu.url} className={menu.cName} style={{marginLeft: "2vw", marginRight: "2vw"}}>
                  <i className={menu.icon} style={{ paddingRight: "10px", color: "black" }}></i>
                  {menu.title}
                </Link>
              </Nav.Link>
            );
          })}
             <WalletMultiButton
            style={{
              fontFamily: "Roboto Mono,monospace",
              fontWeight: "bolder",
              backgroundColor: "black",
              color: "lightskyblue",
            }}
            />
            
          </Nav>
        </Navbar.Collapse>
        {/* </div> */}
      </Container>
    </Navbar>
    // <Box className="w3-animate-opacity App">
    //   <nav className="navbar">
    //     <Box>
    //       <Box className="w3-animate-opacity">
    //         <p className="logo">
    //           <i
    //             className="fa-solid fa-fingerprint"
    //             style={{ color: "white", paddingRight: "15px" }}
    //           ></i>
    //           Proof-Of-Identity
    //         </p>
    //       </Box>
    //     </Box>
    //     <ul className="nav-menu">
    //       {MenuData.map((menu, index) => {
    //         return (
    //           <li key={index}>
    //             <Link to={menu.url} className={menu.cName}>
    //               <i className={menu.icon} style={{ paddingRight: "10px" }}></i>
    //               {menu.title}
    //             </Link>
    //           </li>
    //         );
    //       })}
    //       <WalletMultiButton
    //         style={{
    //           fontFamily: "Roboto Mono,monospace",
    //           fontWeight: "bolder",
    //           fontSize: "18px",
    //           backgroundColor: "white",
    //           color: "lightskyblue",
    //           position: "relative",
    //         }}
    //       />
    //     </ul>
    //   </nav>
    // </Box>
  );
};
