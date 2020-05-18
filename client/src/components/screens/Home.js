import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { UserContext } from '../../App'

const Home = () => {
    const { state, dispatch } = useContext(UserContext)
    const [data, setData] = useState([])
    useEffect(() => {
        fetch("http://localhost:5000/allpost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch("http://localhost:5000/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch("http://localhost:5000/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    /*const delComment = (cid, pid, txt) => {
        fetch("http://localhost:5000/delcomment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text: txt,
                commentId: cid,
                postId: pid
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = data.filter(item => {
                    return item._id != result._id
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }*/

    const makeComment = (text, postId) => {
        fetch("http://localhost:5000/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text

            })
        }).then(res => res.json())
            .then(result => {

                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postId) => {
        fetch(`http://localhost:5000/deletepost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id != result._id
                })
                setData(newData)
            })
    }
    return (
        <div className="home">
            {
                data.map(item => {

                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ padding: "5px" }}>
                                <span style={{ marginRight: "5px" }}><img style={{
                                    marginTop: "5px", width: "35px", height: "35px", borderRadius: "17.5px"
                                }}
                                    src={item.postedBy.pic} /></span>
                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id &&
                                    <i className="material-icons" style={{ float: "right" }}
                                        onClick={() => deletePost(item._id)} >delete</i>}
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {
                                    item.likes.includes(state._id) ?
                                        <i className="material-icons" style={{ color: "red" }} onClick={() => unlikePost(item._id)}>favorite</i>
                                        : <i className="material-icons" onClick={() => likePost(item._id)}>favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}><Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"}>{record.postedBy.name}</Link></span>  {record.text}
                                            </h6>
                                            /*{record.postedBy._id == state._id &&
                                                    <i className="material-icons" style={{ float: "right" }}
                                                        onClick={() => delComment(record._id, item._id, record.text)} >delete</i>} */
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add comment" />
                                </form>
                            </div>
                        </div>
                    )

                })
            }

        </div >
    )
}

export default Home;