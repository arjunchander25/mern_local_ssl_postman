import React from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
import { withRouter } from './utils';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import './Login.css'; // Import the CSS file
import loginImage from './login_pic.png';

var salt = bcrypt.genSaltSync(10);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {
    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post('https://localhost:2000/login', {
      username: this.state.username,
      password: pwd,
    })
    .then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      this.props.navigate("/dashboard");
    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          title: "Error",
          text: err.response.data.errorMessage,
          icon: "error",
          button: "OK",
        });
      }
    });
  }

  render() {
    return (
      <div className="main-container">
        <div className="image-container">
          <img src={loginImage} alt="Login Visual" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="login-container">
          <div className="login-form">
            <h2 style={{ color: 'black', textAlign:'center' }}>Login</h2>
            <TextField
              variant="outlined"
              type="text"
              autoComplete="off"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              placeholder="User Name"
              required
              InputLabelProps={{
                style: { color: '#FFF' },
              }}
              InputProps={{
                style: { backgroundColor: 'white', color: '#000' },
              }}
            />
            <br /><br />
            <TextField
              variant="outlined"
              type="password"
              autoComplete="off"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              placeholder="Password"
              required
              InputLabelProps={{
                style: { color: '#FFF' },
              }}
              InputProps={{
                style: { backgroundColor: 'white', color: '#000' },
              }}
            />
            <br /><br />
            <Button
              variant="contained"
              style={{
                backgroundColor: '#6200EA',
                color: '#FFF',
                width: '100%',
                padding: '10px',
                borderRadius: '20px',
              }}
              disabled={!this.state.username || !this.state.password}
              onClick={this.login}
            >
              Login
            </Button>
            <br /><br />
            <Link
              component="button"
              variant="body2"
              style={{ color: '#800080' }}
              onClick={() => {
                this.props.navigate("/register");
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
