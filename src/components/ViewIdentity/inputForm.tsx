import React from "react";


type State = {
    text: string;
  };
  export class InputPubkey extends React.Component<{}, State> {
    state = {
      text: "",
    };
    
    // typing on RIGHT hand side of =
    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
      this.setState({ text: e.currentTarget.value });
    };
    render() {
      

      return (
        <div>
        <div>
            <label style={{color:"lightskyblue",fontSize:"30px",fontWeight:"bolder"}}>
                Enter your solana Pubkey associated with the digital Identity
            </label>
        </div>
        <br></br>
        <div >
       
         
          
        
  

        
        </div>
        
        </div>
      );
    }
  }
