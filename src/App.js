

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


  //------------------CEO Functions ---------------------------------
 
 
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
   }
   

   
 }, []) 

 
  
//----------------------------USER INTERFACE-----------------------------------------------------------------------------------


  return <div>
    
    <div>{bridgeInitText}</div>
    <h1>Name Registration</h1>
            <p>Check for availability and register your DERO name</p>
            <p>Remember names must be 6 characters or longer. This webiste will tell you "moon" is available but that's a lie. It's not enough characters.</p>
            <p>Emojis and spaces and stuff are allowed, go crazy!</p>
            
            
            <h1> Check Availability </h1>

            <div className="function">
    
    
    <form onSubmit={checkName}>
      <p>Name</p>
      <input id="name" type="text"/>
      <button type={"submit"}>Check Availability</button>
    </form>
    {availability}
    </div>

<h1> Register Name </h1>
    <div className="function">
    
  <form onSubmit={register}>
    <p>Name</p>
    <input id="name" type="text" />
    <button type={"submit"}>Register</button>
  </form>
  
    
    </div>

    


<footer><small>Support by sending dero to "apollo"</small></footer>
  </div>
    
    
   
  
}



export default App;