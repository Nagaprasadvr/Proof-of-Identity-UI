import React from "react";


type State = {
    pubkey: string;
    
  };
  export class InputPubkey extends React.Component<{}, State> {
    state = {
      pubkey: "",
    };
    
    // typing on RIGHT hand side of =
    onChange = (e: React.FormEvent<HTMLInputElement>) => {
      this.setState({ pubkey: e.currentTarget.value });
      console.log(this.state.pubkey.toString());
    
    };
    render() {
      

      return (
        <div>
            <label style={{color:"lightskyblue",fontSize:"30px",fontWeight:"bolder"}}>
                Enter your solana Pubkey associated with the digital Identity
            </label>
            <div style={{marginTop:"20px"}} className = "w3-animate-bottom" >
              <input type ="text"  style={{color:"black",height:"50px",width:"600px",borderRadius:"0.5em",fontSize:"20px"}} placeholder="enter pubkey" onChange={this.onChange}>
              </input>
              </div>
              <div className=" App w3-animate-bottom" style={{ marginTop: '20px', alignContent: 'center',}}>
                        <button style = {{width:"100px"}} className="balance-button w3-btn w3-hover-white App ">
                            submit
                        </button>
              </div>
        </div>
      );
    }
  }
