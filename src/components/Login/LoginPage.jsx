import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import wave from '../../assets/images/wave.png';
import bgImage from '../../assets/images/bg.svg';
import avatarImage from '../../assets/images/avatar.svg';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userActions';
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    error: '',
  });

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (!isValidEmail(formState.email)) {
      setFormState(prev => ({ ...prev, error: 'Please enter a valid email address.' }));
      return false;
    }
    
    if (formState.password.trim() === "") {
      setFormState(prev => ({ ...prev, error: 'Password cannot be empty.' }));
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    axios
      .get('http://localhost:5000/employees')
      .then((response) => {
        const employee = response.data.find(
          (emp) => emp.email === formState.email && emp.password === formState.password
        );
        if (employee) {
          // Extracting data from the employee and storing to the Redux store.
          dispatch(setUser({
            email: employee.email,
            username: employee.username,
            phone: employee.phone         
          }));
          localStorage.setItem('employee', JSON.stringify(employee));
          navigate('/dashboard');
        } else {
          setFormState(prev => ({ ...prev, error: 'Invalid credentials.' }));
        }
      })
      .catch(() => {
        setFormState(prev => ({ ...prev, error: 'An error occurred. Please try again.' }));
      });
  };
  return (
    <>
      <img src={wave} className='wave' alt="Wave" />
      <div className="container">
        <div className="img">
          <img src={bgImage} alt="Background" />
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <img src={avatarImage} alt="User Avatar" />
            {formState.error && 
              <Typography 
                color="error" 
                variant="body1" 
                className="error-text"
              >
                {formState.error}
              </Typography>}
            <h2 className="title">Welcome</h2>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input type="email" className="input" name="email" value={formState.email} onChange={handleChange} placeholder='Email' />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input type="password" className="input" name="password" value={formState.password} onChange={handleChange} placeholder='Password' />
              </div>
            </div>
            <a href="#">Forgot Password?</a>
            <input type="submit" className="btn" value="Login" />
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage;