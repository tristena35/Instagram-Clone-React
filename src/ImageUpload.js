// rfce -> shortcut to build structure
import React, { useState } from 'react';
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import './ImageUpload.css';

function ImageUpload({username}) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // References the storage in the firebase database, and puts image into folder named images
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        // The code below is for the progress bar
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error Function
                console.log(error);
                alert(error.message);
            },
            () => {
                // Complete Function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        // Once function is complete, reset everything
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <div className = "imageupload">
            <h2>Upload an Image!</h2>
            <progress className = "imageupload_progress" value = {progress} max = "100" />
            <input type = "text" placeholder = "Enter a caption..." onChange = {event => setCaption(event.target.value)} value ={caption} />
            <input type = "file" onChange = {handleChange} />
            <Button onClick = {handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
