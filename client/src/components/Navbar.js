import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App'
import M from 'materialize-css';
import "../App.css";
import navBarStyle from '../styles/navBar'

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
                <li key="1" style={navBarStyle.makeVisible}><i data-target="modal1" className="large material-icons modal-trigger">search</i></li>,
                <li key="2"><Link to='/profile'>Profile</Link></li>,
                <li key="3"><Link to='/createpost'>Create Post</Link></li>,
                <li key="4"><Link to='/explore'>Explore</Link></li>,
                <li key="5">

                    <i className=" Large material-icons" style={navBarStyle.logout} onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/signin')
                        }
                    }} > power_settings_new </i>

                    {/* <button className
                        ="btn waves-effect waves-light logout  d#b71c1c red darken-1" onClick={() => } >
                        Logout
                    </button> */}
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

    //as seperate function because to check for the presence of state,else it fires error on logout
    const renderSearch = () => {
        if (state) {
            return (
                <div>
                    <div className="modal-content">
                        <input
                            type="text"
                            placeholder="Search Users"
                            value={search}
                            onChange={(e) => fetchUsers(e.target.value)} />
                        <ul>
                            {
                                userDetails.map(item => {
                                    console.log(item)
                                    return <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"}
                                        onClick={() => {
                                            M.Modal.getInstance(searchModal.current).close()
                                            setSearch("")
                                            //window.open(item._id !== state._id ? "/profile/" + item._id : "/profile", "_self")
                                        }
                                        }>
                                        <li className="collection-item avatar">
                                            <img src={item.pic} style={navBarStyle.searchResDp} alt="" className="circle" />
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

            )
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
            <div id="modal1" className="modal" ref={searchModal} style={navBarStyle.makeVisible}>
                {renderSearch()}
            </div>
        </nav >
    )
}

export default Navbar;