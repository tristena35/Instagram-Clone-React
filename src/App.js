import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  // UseEffect -> runs a piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else {
        // User has logged out
        setUser(null);
      }
    })
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  /* 
    Under, based on changes in the database, this method will be called
  */
  useEffect(() => {
    // Every time the database is updated, snapshot will get the changes
    // desc -> descending order
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      {/* 
        A modal is like a pop up where information can be entered; SIGN UP
      */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className = "app_signup">
            <center>
              <img
                className = "app_headerImage"
                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt = "Instagram Header Logo"
              />
            </center>
            <Input
                placeholder = "email"
                type = "text"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)} 
              />
              <Input
                placeholder = "username"
                type = "text"
                value = {username}
                onChange = {(e) => setUsername(e.target.value)} 
              />
              <Input
                placeholder = "password"
                type = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)} 
              />
              <Button type = "submit" onClick = {signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* 
        A modal is like a pop up where information can be entered; SIGN IN
      */}

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className = "app_signup">
            <center>
              <img
                className = "app_headerImage"
                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt = "Instagram Header Logo"
              />
            </center>
            <Input
                placeholder = "email"
                type = "text"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)} 
              />
              <Input
                placeholder = "password"
                type = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)} 
              />
              <Button type = "submit" onClick = {signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      {/* ---- HEADER ---- */}
      <div className = "app_header">
        <img
          className = "app_headerImage"
          src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt = "Instagram Header Logo"
        />
        {/*
          Code below works as an if or, if the user is logged in, then should sign them out, otherwise log in.
        */}
        {user ? (
          <Button onClick = {() => auth.signOut()}>Logout</Button>
        ): (
          <div className = "app_loginContainer">
            <Button onClick = {() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick = {() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* ---- POSTS ---- */}
      <div className = "app_posts">

        {/* -- LEFT -- */}
        <div className = "app_postsLeft">
          {/*
            - Under, we populate the posts in real time with the names they were given on firebase
            - Using a key is very efficient since when changes are made it will only update the 
            one post instead of refreshing them all
          */}
          {
            posts.map(({id, post}) => (
              <Post 
                key = {id}
                postId = {id} 
                user = {user}
                username = {post.username} 
                caption = {post.caption} 
                imageUrl = {post.imageUrl}>
              </Post>
            ))
          }
        </div>

        {/* -- RIGHT -- 
        <div className = "app_postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div> 

      {/* The question mark next to user says dont freak out an break if */}

      <div className = "app_imageUploader">
        {user?.displayName ? (
          <ImageUpload username = {user.displayName} ></ImageUpload>
        ): (
          <h3>Login to upload</h3>
        )}
      </div>

    </div>
  );
}

export default App;
