import React from "react";
import { InputForm } from "../InputForm/InputForm";
import "../../App.css";
export const Home = () => {
  return (
    <div className="App">
      <h1 className="w3-animate-opacity">
        <b>Create your Digital identity on Solana chain!</b>
      </h1>
      <div className="w3-animate-opacity w3-jumbo">
        <i className="fa fa-fingerprint" style={{ color: "lightskyblue" }}></i>
      </div>
      <InputForm />
    </div>
  );
};
