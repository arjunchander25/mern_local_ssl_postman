import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, Card, CardContent, CardActions
} from '@material-ui/core';
import { Toolbar } from '@material-ui/core';
import './dashboard.css';
import { Pagination } from '@material-ui/lab';
// eslint-disable-next-line
import swal from 'sweetalert';
import { withRouter } from './utils';
const axios = require('axios');
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      assignment_details: '',
      total_marks: '',
      deadline: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      // this.props.history.push('/login');
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  }

  getProduct = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`https://localhost:2000/get-product${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      // swal({
      //   text: err.response.data.errorMessage,
      //   icon: "error",
      //   type: "error"
      // });
      this.setState({ loading: false, products: [], pages: 0 },()=>{});
    });
  }
  deleteProduct = (id) => {
    axios.delete(`https://localhost:2000/delete-product/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      // swal({
      //   text: 'Task Deleted',
      //   icon: "success",
      //   type: "success"
      // });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      // swal({
      //   text: err.response.data.errorMessage,
      //   icon: "error",
      //   type: "error"
      // });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    // this.props.history.push('/');
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    // eslint-disable-next-line
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('assignment_details', this.state.assignment_details);
    file.append('deadline', this.state.deadline);
    file.append('total_marks', this.state.total_marks);

    axios.post('https://localhost:2000/add-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      // swal({
      //   text: res.data.title,
      //   icon: "success",
      //   type: "success"
      // });

      this.handleProductClose();
      this.setState({ name: '', assignment_details: '', deadline: '', total_marks: '', file: null, page: 1 }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      // swal({
      //   text: err.response.data.errorMessage,
      //   icon: "error",
      //   type: "error"
      // });
      this.handleProductClose();
    });

  }

  updateProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('assignment_details', this.state.assignment_details);
    file.append('deadline', this.state.deadline);
    file.append('total_marks', this.state.total_marks);

    axios.put('https://localhost:2000/update-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      // swal({
      //   text: res.data.title,
      //   icon: "success",
      //   type: "success"
      // });

      this.handleProductEditClose();
      this.setState({ name: '', assignment_details: '', deadline: '', total_marks: '', file: null }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      // swal({
      //   text: err.response.data.errorMessage,
      //   icon: "error",
      //   type: "error"
      // });
      this.handleProductEditClose();
    });

}

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: '',
      name: '',
      assignment_details: '',
      total_marks: '',
      deadline: '',
      fileName: ''
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (data) => {
    this.setState({
      openProductEditModal: true,
      id: data._id,
      name: data.name,
      assignment_details: data.assignment_details,
      total_marks: data.total_marks,
      deadline: data.deadline,
      fileName: data.image
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    return (
      <div>
      <Toolbar style={{ justifyContent: 'flex-end', position: 'absolute', top: 0, right: 0 }}>
  <TextField
    id="standard-basic"
    type="search"
    autoComplete="off"
    name="search"
    value={this.state.search}
    onChange={this.onChange}
    placeholder="Search"
  />
</Toolbar>

        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2 style={{ color: 'black', fontWeight: 'bold' }}>Assignment Manager</h2>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
            style={{
              backgroundColor: '#4CAF50', // Your desired background color
              color: 'white' 
            }}
          >
            Add
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
            style={{
              backgroundColor: 'black', // Your desired background color
              color: 'white' 
            }}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Product */}
        <Dialog
          open={this.state.openProductEditModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          // eslint-disable-next-line
          aria-assignment_detailsribedby="alert-dialog-assignment_detailsription"
          PaperProps={{
            style: {
              padding:"2%",
              background: 'linear-gradient(135deg, rgb(235, 43, 43) 0%, yellow 100%)',
              color: 'white',
              width:"100vw",
              borderRadius: '20px'
            }
          }}
          
        >
          <DialogTitle id="alert-dialog-title"
          >Edit Assignment</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Assignment Name"
              required
             
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="assignment_details"
              value={this.state.assignment_details}
              onChange={this.onChange}
              placeholder="Assignment Details"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="total_marks"
              value={this.state.total_marks}
              onChange={this.onChange}
              placeholder="Total Marks"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="deadline"
              value={this.state.deadline}
              onChange={this.onChange}
              placeholder="Deadline"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
              style={{
                backgroundColor: 'light-grey', // Your desired background color
                color: 'black', // Your desired text color
              }}
            > Upload
            <input
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose} color="primary"
            style={{
              margin:'1%',
              backgroundColor: 'black', // Your desired background color
              color: 'white'
            }}>
              Cancel
            </Button>
            <Button
            // eslint-disable-next-line
              disabled={this.state.name == '' || this.state.assignment_details == '' || this.state.deadline == '' || this.state.total_marks == ''}
              onClick={(e) => this.updateProduct()} color="primary" autoFocus
              style={{
                backgroundColor: '#4CAF50', // Your desired background color
                color: 'white'
              }}>
              
              Edit Task
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Product */}
        <Dialog 
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          // eslint-disable-next-line
          aria-assignment_detailsribedby="alert-dialog-assignment_detailsription"
          PaperProps={{
            style: {
              padding:'2%',
              background: 'linear-gradient(135deg, rgb(235, 43, 43) 0%, yellow 100%)',
              color: 'white',
              width:"100vw",
              borderRadius: '20px'
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">Add Assignment</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Assignment Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="assignment_details"
              value={this.state.assignment_details}
              onChange={this.onChange}
              placeholder="Assignment Details"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="total_marks"
              value={this.state.total_marks}
              onChange={this.onChange}
              placeholder="Total Marks"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="deadline"
              value={this.state.deadline}
              onChange={this.onChange}
              placeholder="Deadline"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
                required
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary"
            style={{
              backgroundColor: 'black', // Your desired background color
              color: 'white'
            }}>
              Cancel
            </Button>
            <Button
            // eslint-disable-next-line
              disabled={this.state.name == '' || this.state.assignment_details == '' || this.state.deadline == '' || this.state.total_marks == '' || this.state.file == null}
              onClick={(e) => this.addProduct()} color="primary" autoFocus
              style={{
                backgroundColor: '#4CAF50',
                color: 'white'
              }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <div className="card-container">
          {this.state.products.map((product) => (
            <Card key={product._id} className="product-card" style={{ backgroundColor: 'skyblue' }}>
            <CardContent>
              <h3>{product.name}</h3>
              <img src={`https://localhost:2000/${product.image}`} alt={product.name} />
              <p>{product.assignment_details}</p>
              <p>Total Marks: {product.total_marks}</p>
              <p>Deadline: {product.deadline}</p>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                onClick={() => this.handleProductEditOpen(product)}
                style={{ backgroundColor: 'green', color: 'white', border: '1px solid black' }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                onClick={() => this.deleteProduct(product._id)}
                style={{ backgroundColor: 'red', color: 'white', border: '1px solid red' }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
          
          ))}
        </div>

        <br />

        <div className="paginationContainer">
  <Pagination
    count={this.state.pages}
    page={this.state.page}
    onChange={this.pageChange}
  />
</div>


      </div>
    );
  }
}

export default withRouter(Dashboard);
