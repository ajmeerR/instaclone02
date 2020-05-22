import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
import userProfileStyle from '../styles/userProfile';

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
    //const [showfollow, setShowFollow] = useState(userProfile.following.filter(item => item == userid))
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setProfile(result)
            })
        // console.log(userProfile.name)
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }

                    }
                })
                setShowFollow(false)
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    const newfollowers = prevState.user.followers.filter(item => item != data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newfollowers
                        }

                    }
                })
                setShowFollow(true)
            })
    }
    return (
        <>
            {userProfile ?
                <div style={userProfileStyle.wholeContainer}>
                    <div style={userProfileStyle.innerContainer}>
                        <div>
                            <img style={userProfileStyle.dpStyle}
                                src={userProfile.user.pic} />

                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={userProfileStyle.infoText}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {showfollow
                                ? <button className
                                    ="btn waves-effect waves-light #ef5350 blue darken-1" onClick={() => followUser()} style={{ margin: "10px" }} >
                                    follow
                                </button>
                                : <button className
                                    ="btn waves-effect waves-light #ef5350 blue darken-1" onClick={() => unfollowUser()} style={{ margin: "10px" }} >
                                    Unfollow
                                </button>}
                        </div>
                    </div>
                    {<div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }
                    </div>}
                </div >
                : <div className="preloader-wrapper big active" style={userProfileStyle.loaderPos}>
                    <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div><div className="gap-patch">
                            <div className="circle"></div>
                        </div><div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default UserProfile;