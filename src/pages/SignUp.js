import React, { useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

import { Link, useNavigate } from 'react-router-dom';

import { AuthProvider, useAuth } from '../contexts/AuthContext'

import '../css/SignUp.css'

export default function SignUp(){

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('passwords do not match');
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate('/', {replace: true});
        } catch {
            setError('failed to create an account');
        }
        setLoading(false);
    }

    return (
        <>
            <NavBar/>
            
            <div id = 'signup'>
                <div id = 'card'>
                    <h2>sign up</h2>
                    {error && <p id = 'error'>{error}</p>}
                    
                    <form onSubmit={handleSubmit} id='form'>
                        <form id='email'>
                            <p>email</p>
                            <input type='email' ref = {emailRef} required/>
                        </form>

                        <form id='password'>
                            <p>password</p>
                            <input type='password' ref = {passwordRef} required/>
                        </form>

                        <form id='password-confirm'>
                            <p>confirm password</p>
                            <input type='password' ref = {passwordConfirmRef} required/>
                        </form>

                        <button type='submit' disabled={loading}>sign up</button>
                    </form>
                </div>

                <p>already have an account? <Link to='/login'>Log In</Link></p>

            </div>
            
            <Footer/>
        </>
    )
}
