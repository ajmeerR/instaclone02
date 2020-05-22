import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';



const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [pwdVisibility, setpwdVisibility] = useState(false)
    const [policyVisibility, setpolicyVisibility] = useState(false)
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
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

    const uploadFields = () => {
        var pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!@#\$%\^&\*])(?=.{8,})");
        if (!pwdRegex.test(password)) {
            return M.toast({ html: "Check the password policy", classes: "#b71c1c red darken-4" })
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return M.toast({ html: "invalid email", classes: "#b71c1c red darken-4" })
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#b71c1c red darken-4" })
                }
                else {
                    M.toast({ html: data.message, classes: "#66bb6a green lighten-1" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    const PostData = () => {
        if (image) {
            uploadPic()
        }
        else {
            uploadFields()
        }

    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    type={pwdVisibility ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <i className="material-icons pwd-iconsp" onClick={() => setpwdVisibility(!pwdVisibility)}>remove_red_eye</i>
                <div className="tooltip">
                    <i className="material-icons info " onClick={() => setpolicyVisibility(!policyVisibility)}>info_outline</i>
                    <span className="tooltiptext">password policy</span>
                </div>
                <div style={{ display: policyVisibility ? "block" : "none" }}>
                    <ol style={{ textAlign: "left" }}>
                        <b>The password must contain</b><br />
                        <li>at least 1 lowercase alphabetical character</li>
                        <li>at least 1 uppercase alphabetical character</li>
                        <li>at least 1 numeric character</li>
                        <li>at least one special character</li>
                        <li>at least eight characters or longer</li>
                    </ol>
                </div>
                <div className="file-field input-field">
                    <div className="upload" >
                        <span>Upload DP</span>
                        <i className=" small material-icons upic">cloud_upload</i>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper" >
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className
                    ="btn-hover color-4 submit" onClick={() => PostData()}>
                    Signup
                </button>
                <h6>
                    <Link to="/signin">Already having an account?</Link>
                </h6>

            </div>
        </div >
    )
}

export default Signup;