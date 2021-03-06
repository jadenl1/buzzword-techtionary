import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthProvider, useAuth } from '../contexts/AuthContext'
import {db} from '../firebase'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

import '../css/Profile.css'
import Post from '../components/Post'

export default function Profile(){
    
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const atPos = (currentUser.email).indexOf("@");
    const userName = "@" + (currentUser.email).slice(0, atPos);
    const emailExt = (currentUser.email).slice(atPos, currentUser.length);

    const [posts, setPosts] = useState([]);

    
    // setPosts(db.collection("posts").where("username", "==", userName).get());
    // console.log(posts);

    useEffect(() => {
        const getPostsFromFirebase = [];
        const subscriber = db
        .collection('posts')
        .where("userID", "==", currentUser.uid)
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                getPostsFromFirebase.push({
                    ...doc.data(),
                    key: doc.id,
                });
            });
            setPosts(getPostsFromFirebase);
        });

        return () => subscriber();
    }, []);


    async function handleLogout(){

        setError("");

        try{
            logout();
            navigate("/", {replace: true})
        } catch {
            setError('Failed to log out')
        }
    }
    
    return (
        <>
            <NavBar/>
            <div id="profile-page">
                <div id='profile-head'>
                    <p>MY PROFILE &#8628;</p>
                    <div id = 'full-name'>
                        <p id = 'name'>{userName}</p>
                        <p id = 'email-ext'>{emailExt}</p>
                    </div>
                    <div id = 'buttons'>
                        <Link to='/update-profile'><button>update profile</button></Link>
                        <a><button onClick={handleLogout}>log out</button></a>
                    </div>
                </div>
                <div id="posts">
                    <h2 id="sub-title">your posts&#8628;</h2>
                    {posts.length > 0 ? (
                        posts.slice(0,10).map((post) => {
                            return(
                                <AuthProvider>
                                    <Post entry = {post}/>
                                </AuthProvider>
                            );
                        })
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>

            <Footer/>
        </>
    )
}
