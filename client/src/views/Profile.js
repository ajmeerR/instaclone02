import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import profileStyle from '../styles/profile';

const Profile = () => {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    useEffect(() => {
        fetch("/mypost", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setPics(result.mypost)
            })
    }, [])

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "instaClone")
            data.append("cloud_name", "clonegram")
            fetch("	https://api.cloudinary.com/v1_1/clonegram/image/upload", {
                method: "post",
                body: data,
            }).then(res => res.json())
                .then(data => {
                    fetch("/updatepic", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                        })

                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePic = (newpic) => {
        setImage(newpic)
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={profileStyle.wholeContainer}>
                <div style={profileStyle.midBarrierContainer}>
                    <div>
                        <img style={profileStyle.dpStyle}
                            src={state ? state.pic : "loading"} />

                    </div>
                    <div>
                        <h4>{state ? state.name : "Loading"}</h4>
                        <h5>{state ? state.email : "Loading"}</h5>
                        <div style={profileStyle.infoText}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={profileStyle.fileUpload}>
                    <div className="btn-hover color-4 fsubmit">
                        <span style={profileStyle.futext}>Change pic</span>
                        <input type="file" onChange={(e) => updatePic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" style={{ border: "none" }} />
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div >
    )
}

export default Profile;