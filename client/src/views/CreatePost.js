import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';
import createStyle from '../styles/createPost';

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#b71c1c red darken-4" })
                    }
                    else {
                        M.toast({ html: "created post successfuly", classes: "#66bb6a green lighten-1" })
                        history.push('/explore')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instaClone")
        data.append("cloud_name", "clonegram")
        fetch("	https://api.cloudinary.com/v1_1/clonegram/image/upload", {
            method: "post",
            body: data,
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="card input-fields" style={createStyle.card}>
            <input type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="upload">
                    <span>Upload Image</span>
                    <i className=" small material-icons upic">cloud_upload</i>
                </div>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className
                ="btn-hover color-4 submit" onClick={() => postDetails()} >
                Submit
            </button>
        </div>
    )
}

export default CreatePost; 