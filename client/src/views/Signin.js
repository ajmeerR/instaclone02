import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';


const Signin = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [pwdVisibility, setpwdVisibility] = useState(false)
    const PostData = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return M.toast({ html: "invalid email", classes: "#b71c1c red darken-4" })
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#b71c1c red darken-4" })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Signed in Successfuly", classes: "#66bb6a green lighten-1" })
                    history.push('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="mycard" >
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
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
                <i className="material-icons pwd-icon" onClick={() => setpwdVisibility(!pwdVisibility)}>remove_red_eye</i>
                <button className
                    ="btn-hover color-4 submit" onClick={() => PostData()} >
                    Login
                </button>
                <h6 style={{ marginLeft: "10px" }}>
                    <Link to="/signup">don't have an account?</Link>
                </h6>

            </div>
        </div>

    )

}

export default Signin;