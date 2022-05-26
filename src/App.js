

import DeroBridgeApi from './api.js'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import './app.css'

const App = () => {

  
  const [availability, setAvailability] = React.useState('')
  const deroBridgeApiRef = React.useRef()
  const [bridgeInitText, setBridgeInitText] = React.useState('Not connected to extension')

  React.useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi()
      const deroBridgeApi = deroBridgeApiRef.current
      const [err] = await to(deroBridgeApi.init())
      if (err) {
        setBridgeInitText('failed to connect to extension')
      } else {
        setBridgeInitText('connected to extension')
      }
    }

    window.addEventListener('load', load)
    return () => window.removeEventListener('load', load)
  }, [])


  //------------------WALLET Functions ---------------------------------
 
 
  const register = React.useCallback(async (event) => {
    event.preventDefault();
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": "0000000000000000000000000000000000000000000000000000000000000001",
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "Register"
    	},
    	{
    		"name": "name",
    		"datatype": "S",
    		"value": event.target.name.value
    	}]
    }))

    console.log(err)
    console.log(res)
  }, [])

  const transfer = React.useCallback(async (event) => {
    event.preventDefault();
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
    	"scid": "0000000000000000000000000000000000000000000000000000000000000001",
    	"ringsize": 2,
    	"sc_rpc": [{
    		"name": "entrypoint",
    		"datatype": "S",
    		"value": "TransferOwnership"
    	},
    	{
    		"name": "name",
    		"datatype": "S",
    		"value": event.target.name.value
    	},
        {
    		"name": "newowner",
    		"datatype": "S",
    		"value": event.target.address.value
    	}]
    }))

    console.log(err)
    console.log(res)
  }, [])

 

  //--------------------DAEMON FUNCTIONS----------------------------------
  



  const checkName = React.useCallback(async (event) => {
    event.preventDefault();
   const deroBridgeApi = deroBridgeApiRef.current
   const [err, res] = await to(deroBridgeApi.daemon('get-sc', {
           scid:"0000000000000000000000000000000000000000000000000000000000000001",
           code:false,
           variables:true
   }))
   /* let test= `data`
   let voteStatus=res */
   let name = event.target.name.value

   //let search = "vote_" +index+"_type"
   let result=res.data.result.stringkeys[name]

  

   console.log(err)
   console.log(res)
   console.log(result)
   if(result){
     setAvailability("Shucks, this name is unavailable");
   }else{
     setAvailability("This name is available!")
     console.log("lenght" + name.length)
     if(name.length <6 ){
      setAvailability("This name is too short")
      

   }
  
   }
   if(name === "e=mc²"){
     setAvailability("This name was foolishly burned by apollo")
   }
   

   
 }, []) 

 
  
//----------------------------USER INTERFACE-----------------------------------------------------------------------------------


  return <div>
    
    <div>{bridgeInitText}</div>
    <h1>Name Registration</h1>
            <p>Check for availability and register your DERO name</p>
            <p>Remember names must be 6 characters or longer.</p>
            <p>Names are CASE-sensitive. "Apollo" is not the same as "apollo". Numbers, spaces, special characters, and emojis are allowed.</p>
            <p><i>New!</i> Now you can also transfer a name you already own to another wallet address.</p>
            <p> Note: You may not send a name to another name. I tried this with e=mc² and now that name is lost forever. It has been burned and nobody can own it now.</p>
            <p> Now you may be wondering, isn't e=mc² less than six characters? Answer: Dero will count certain special characters as more than 1. For instance someone successfully registered 🅱️🅾️🅾️🅱️🅰️.. </p>
            <p>This website will not account for that when it tells you that your name is too short. If your special short name is unavailable it will say so. If it says it is too short but you know it will work, then go for it. </p>
            
            <a href="https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd">Oh and you'll need to download this extension</a>
            
            
            
            <div className="function-container">

            <div className="function">
    <h3>Check Availability</h3>
    <div className="check">
    
    <form onSubmit={checkName}>
      <input placeholder="name" id="name" type="text"/>
      <button type={"submit"}>Check Availability</button>
    </form>
    {availability}
    </div>
    </div>


    <div className="function">
      <h3>Register Name</h3>
  <form onSubmit={register}>
    <input placeholder="name" id="name" type="text" />
    <button type={"submit"}>Register</button>
  </form>
  
    
    </div>

    <div className="function">
      <h3><i>New!</i> Transfer Name</h3>
  <form onSubmit={transfer}>
    <input placeholder="name" id="name" type="text" />
    <input placeholder="recipient address" id="address" type="text" />
    <button type={"submit"}>Transfer</button>
  </form>
  
    
    </div>
    </div>

    


<footer><small>Support by sending dero to "apollo"</small></footer>
  </div>
    
    
   
  
}



export default App;