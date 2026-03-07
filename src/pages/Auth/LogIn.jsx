
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';


import useAuth from '../../hook/useAuth';
import SocialLogin from './SocialLogin';
import { Bounce, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from '../../components/Loading/Loading';

// import Loading from '../../components/Loading/Loading';

const LogIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signInUser,loading } = useAuth();
    const location = useLocation()
    const navigate = useNavigate()
    const handleLogIn = (data) => {

        signInUser(data.email, data.password)
            .then(result => {
                console.log(result.user)
                navigate(location.state || "/")
            })
            .catch(error => {
                console.log(error)
                toast.error('Email and password is incorrect!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            })
    }
    const [showPassword,setShowPassword]=useState(false)
    const handleTogglePasswordShow=(event)=>{
        event.preventDefault()
        setShowPassword(!showPassword)
    }
    if(loading){
        return <Loader/>
    }
    return (
        <div className="card  w-full max-w-lg pt-14   ">
            <div className="card-body">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-center text-[42px]">Welcome Back</h1>
                {/* <p className='text-base font-normal'>Login with ZapShift  </p> */}

                <form onSubmit={handleSubmit(handleLogIn)}>

                    <fieldset className="fieldset">


                        {/* email */}
                        <label className="label text-black">Email Address</label>
                        <div className=' '>
                            <input type="email"  {...register("email", { required: true })}
                                className="input w-full outline-primary border-0" name='email'
                                placeholder="Email Address" />
                            {
                                errors.email?.type === "required" &&
                                <p className='text-red-600'>Email is required</p>
                            }
                        </div>

                        {/* password */}
                        <div className='relative'>

                        
                        <label className="label text-black">Password</label>
                        <input type={showPassword? 'text' : 'password'}
                            name='password' {...register("password",
                                {
                                    require: true,
                                    minLength: 6,
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                                })}
                            className="input outline-primary border-0 w-full"
                            placeholder="Password" />
                            <button
                            onClick={handleTogglePasswordShow}
                            className="btn btn-xs text-base-content absolute top-6.5 right-4">
                                {showPassword ? <FaEye />  : <FaEyeSlash />}
                                 </button>

                        {
                            errors.password?.type === "required" &&
                            <p className='text-red-600'>Password is required</p>
                        }
                        {
                            errors.password?.type === "minLength" &&
                            <p className='text-red-600'>Password must be a 6 character</p>
                        }
                        {
                            errors.password?.type === "pattern" &&
                            <p className='text-red-600'>Password must have  one uppercase ,one lowercase
                                and special character
                            </p>
                        }
                        </div>
                        <div><Link to="/forget-password" className="link link-hover">Forgot password?</Link></div>

                        {/* {
                                    error  && <p className='text-red-500'>{error}</p>
                                } */}

                        <button className="btn btn-primary   mt-4">Login</button>
                        {/* Google */}
                        <p className='text-base description'>Don’t have any account?
                            <Link
                                state={location.state}
                                to="/register" className='text-primary'> Register</Link></p><br />
                        <SocialLogin></SocialLogin>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default LogIn;



