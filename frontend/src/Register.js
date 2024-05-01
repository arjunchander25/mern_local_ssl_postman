import React from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
import { withRouter } from './utils';
import axios from 'axios';
import './Login.css'; // Use the same CSS for styling consistency
import registerImage from './login_pic.png'; // Import your registration image or reuse the login image

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: '',
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {
    if (this.state.password !== this.state.confirm_password) {
      swal({
        title: "Error",
        text: "Passwords do not match.",
        icon: "error",
        button: "OK",
      });
      return;
    }

    axios.post('https://localhost:2000/register', {
      username: this.state.username,
      password: this.state.password,
    })
    .then((res) => {
      swal({
        title: "Success",
        text: "Registration successful",
        icon: "success",
        button: "OK",
      });
      this.props.navigate("/"); // Assuming this is routed correctly
    })
    .catch((err) => {
      swal({
        title: "Failed to Register",
        text: err.response.data.errorMessage,
        icon: "error",
        button: "OK",
      });
    });
  };

  render() {
    return (
      <div className="main-container">
        <div className="image-container">
          <img src={registerImage} alt="Register Visual" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="login-container">
          <div className="login-form">
            <h2 style={{ color: 'black', textAlign: 'center' }}>Sign Up</h2>
            <TextField
              variant="outlined"
              type="text"
              autoComplete="off"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              placeholder="User Name"
              required
              InputLabelProps={{ style: { color: '#FFF' } }}
              InputProps={{ style: { backgroundColor: 'white', color: '#000' } }}
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
              InputLabelProps={{ style: { color: '#FFF' } }}
              InputProps={{ style: { backgroundColor: 'white', color: '#000' } }}
            />
            <br /><br />
            <TextField
              variant="outlined"
              type="password"
              autoComplete="off"
              name="confirm_password"
              value={this.state.confirm_password}
              onChange={this.onChange}
              placeholder="Confirm Password"
              required
              InputLabelProps={{ style: { color: '#FFF' } }}
              InputProps={{ style: { backgroundColor: 'white', color: '#000' } }}
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
              disabled={!this.state.username || !this.state.password || !this.state.confirm_password}
              onClick={this.register}
            >
              Sign up
            </Button>
            <br /><br />
            <Link
              component="button"
              variant="body2"
              style={{ color: '#800080' }}
              onClick={() => this.props.navigate("/")}
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
