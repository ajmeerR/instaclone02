import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App'
import M from 'materialize-css';
import "../App.css";

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if (state) {
            return [
                <li key="1" style={{ color: "black" }}><i data-target="modal1" className="large material-icons modal-trigger">search</i></li>,
                <li key="2"><Link to='/profile'>Profile</Link></li>,
                <li key="3"><Link to='/createpost'>Create Post</Link></li>,
                <li key="4"><Link to='/explore'>Explore</Link></li>,
                <li key="5">
                    <button className
                        ="btn waves-effect waves-light  d#b71c1c red darken-4" onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/signin')
                        }} >
                        Logout
                    </button>
                </li >
            ]
        }
        else {
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }

    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/searchusers', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(result => {
                setUserDetails(result.user)
            })
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Search Users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)} />
                    <ul>
                        {
                            userDetails.map(item => {
                                return <Link
                                    onClick={() => {
                                        M.Modal.getInstance(searchModal.current).close()
                                        setSearch("")
                                        window.open(item._id !== state._id ? "/profile/" + item._id : "/profile", "_self")
                                    }
                                    }>
                                    <li className="collection-item avatar">
                                        <img src={item.pic} style={{ width: "35px", height: "35px", borderRadius: "17.5px" }} alt="" className="circle" />
                                        <span className="title" >{item.name}</span>
                                    </li></Link>
                            })
                        }

                    </ul>
                    {/* <ul class="collection">
                        <li class="collection-item">Alvin</li>
                        <li class="collection-item">Alvin</li>
                        <li class="collection-item">Alvin</li>
                        <li class="collection-item">Alvin</li>
                    </ul> */}
                </div>
                <div className="modal-footer">
                    <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch("")}>Close</button>
                </div>
            </div>
        </nav >
    )
}

export default Navbar;