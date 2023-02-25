import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import Navbar from "../layout/Navbar";

function Login({login,isAuthenticated}) {
  const navigate = useNavigate();
  useEffect(() => {
    if(isAuthenticated){
      return navigate("/map");
    }
  },[isAuthenticated]);

  const [formData,setFormData]=useState(
    {
      email:"",
      password:""
    }
  );
  const {email,password}= formData;
  const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});
    const onSubmit = async e =>{
      e.preventDefault();
      login(email,password);
    };

    // //redirect 
    // if(isAuthenticated){
    //   const navigate = useNavigate();
    //   return navigate("/map");
    // }
   
  return (
    <Fragment>
    <Navbar/>
    <div>
      <section className="container1">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" >
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email} onChange={e=> onChange(e)} 
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} onChange={e=> onChange(e)} required
          />
        </div>
        <button onClick={e => onSubmit(e)} className="btn btn-primary" value="Login" >Login</button>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
    </div>
    </Fragment>
  );
};
Login.propTypes={
  login: PropTypes.func.isRequired,
  isAuthenticated : PropTypes.bool
};
const mapStateToProps = state=>({
  isAuthenticated:state.auth.isAuthenticated
});

export default connect(mapStateToProps,{login})(Login);
