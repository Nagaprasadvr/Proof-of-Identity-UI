import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { MenuData } from "./MenuData";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Box } from '@mui/material';
import "../../App.css";
require("@solana/wallet-adapter-react-ui/styles.css");

export const Navbar = () => {
  return (
    <Box className="w3-animate-opacity App">
      <nav className="navbar">
        <Box>
          <Box className="w3-animate-opacity">
            <p className="logo">
              <i
                className="fa-solid fa-fingerprint"
                style={{ color: "white", paddingRight: "15px" }}
              ></i>
              Proof-Of-Identity
            </p>
          </Box>
        </Box>
        <ul className="nav-menu">
          {MenuData.map((menu, index) => {
            return (
              <li key={index}>
                <Link to={menu.url} className={menu.cName}>
                  <i className={menu.icon} style={{ paddingRight: "10px" }}></i>
                  {menu.title}
                </Link>
              </li>
            );
          })}
          <WalletMultiButton
            style={{
              fontFamily: "Roboto Mono,monospace",
              fontWeight: "bolder",
              fontSize: "18px",
              backgroundColor: "white",
              color: "lightskyblue",
              position: "relative",
            }}
          />
        </ul>
      </nav>
    </Box>
  );
};
