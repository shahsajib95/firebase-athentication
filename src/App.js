import React, {useState} from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from './firebase.config';

var provider = new firebase.auth.GoogleAuthProvider();
firebase.initializeApp(firebaseConfig);

function App() {
  const [logInUser, setLogInUser] = useState(false)
  const [user, setUser] = useState({
    isSignedin: false,
    name: '',
    photo: '',
    email: '',
    password: ''

  })
  const [newUser, setNewUser] = useState({
    isSignedin: false,
    name: '',
    photo: '',
    email: '',
    password: ''
  })
  const handleGoogleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName, photoUrl, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        photo: photoUrl,
        email: email
      }
      setUser(signedInUser)
    })
    .catch(err=>{
     
    })
  }
  const handleGoogleSignOut = () =>{
    firebase.auth().signOut()
    .then(res=>{
      const user ={
      isSignedin: false,
      name: '',
      photo: '',
      email: '',
      password: '',
      error: '',
      success: false
      }
      setUser(user)
    })
    .catch(err=>{
     
    })
  }

  const handleChange = (e) =>{
    let isFormValid = true;
    if(e.target.name === 'email'){ 
      isFormValid =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.target.value)
    }
    if(e.target.name === 'password'){
      const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(e.target.value)
      isFormValid = isValidPassword;
    }
    if(isFormValid){
      const newUserinfo = {...newUser}
      newUserinfo[e.target.name] = e.target.value;
      setNewUser(newUserinfo);
    }
  }
  const handleSubmit = (e) =>{
    if(logInUser && newUser.email && newUser.password){
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(res=>{
      const newUserInfo = {...newUser}
      newUserInfo.error = '';
      newUserInfo.success = true;
      setNewUser(newUserInfo)
      
    })
    .catch(err =>  {
      // Handle Errors here. 
      const newUserinfo = {...newUser}
      newUserinfo.success = false;
      newUserinfo.error = err.message;
      setNewUser(newUserinfo)
    });
  }
    if(!logInUser && newUser.email && newUser.password){
      firebase.auth().signInWithEmailAndPassword(newUser.email, newUser.password)
      .then(res=>{
        const newUserInfo = {...newUser}
        newUserInfo.error = '';
        newUserInfo.success = true;
        setNewUser(newUserInfo)
        updateUser(newUser.name)
        console.log(res.user)
      })
      .catch(err=> {
        // Handle Errors here.
        const newUserinfo = {...newUser}
        newUserinfo.success = false;
        newUserinfo.error = err.message;
        setNewUser(newUserinfo)
        // ...
      });
    }
    e.preventDefault()
  }

  const updateUser = name =>{
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name
    })
    .then(res=>{
      console.log(res, 'username updated successfully')
    })
    .catch(err=>{
      console.log(err)
    })

  }
  return (
    <div className="App">
      {
        user.isSignedIn && 
        <div>
        <h1>Welcome, {user.name}</h1>
        <h3>Email: {user.email}</h3>
        </div>
      }
      { 
      user.isSignedIn ?
      <button style={{marginTop: '30px'}} onClick={handleGoogleSignOut}>Sign out</button>
      :
      <button style={{marginTop: '30px'}} onClick={handleGoogleSignIn}>Sign in with Google</button>
      }

      <div style={{marginTop: '30px'}}>
        <p>Email: {newUser.email}</p>
        <p>Name: {newUser.name}</p>
        <input type="checkbox" onChange={()=> setLogInUser(!logInUser)} name="newUser" id=""></input>
        <label htmlFor="newUser">Sign Up</label>
        <form onSubmit={handleSubmit}>
        {logInUser && <input type="text" onBlur={handleChange} name="name" placeholder="Enter Your Name" required></input>}
        <br></br>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your Email" required></input>
        <br></br>
        <input type="password"  onBlur={handleChange} name="password" placeholder="Password" required></input>
        <br></br>
        <input type="submit" value={logInUser ? "sign Up" : "sign In"}/>
        { newUser.success ?
        <p style={{color: "green"}}>User {logInUser ? 'Created' : 'Logged in' } Successfully</p>
        :
        <p style={{color: "red"}}>{newUser.error}</p>
        }
        </form>
      </div>
    </div>
  );
}

export default App;
