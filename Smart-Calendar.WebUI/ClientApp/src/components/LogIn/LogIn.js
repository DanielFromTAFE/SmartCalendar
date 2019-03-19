import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form, Loader } from 'semantic-ui-react';
import axios from "axios";
import Validation from '../Validation/Validation';
import * as actions from "../../store/actions/index";


class LogIn extends Component {
    constructor(props) {
        super(props);
        //validation object
        this.validator = new Validation([
            {
                field: 'email',
                method: 'isEmpty',
                validWhen: false,
                message: 'Email is required.'
            },
            {
                field: 'email',
                method: 'isEmail',
                validWhen: true,
                message: 'That is not a valid email.'
            },
            {
                field: 'password',
                method: 'isEmpty',
                validWhen: false,
                message: 'Password is required.'
            }
        ]);

        this.state = {
            modalOpen: false,
            email: '',
            password: '',
            validator: this.validator.valid()
        };
        this.submitted = false;
    }

    handleOpen = () => {
        this.props.login(true);
    }

    handleClose = (e) => {

        e.preventDefault();
        let logindata = {
            email: this.state.email,
            password: this.state.password
        };
        const valid = this.validator.validate(this.state);
        this.setState({ valid });
        this.submitted = true;

        if (valid.isValid) {
            // handle actual form submission here

            console.log(logindata);
            axios({
                method: 'post',
                url: 'https://localhost:44314/api/Account/Login',
                data: logindata
            }).then(function (res) {
                console.log(res.data);

                //if (res.status === 200) {
                //    alert("Login Successful");
                //}
                //else {
                //    alert("Unathorized Access");
                //}
                }).catch(err => {
                    console.log(err);
                });
            this.props.login(false);
        }
    }

    handlesignupopen = () => {
        this.props.login(false);
        this.props.signUp(true);
    }
    handleemail = (e) => {
        this.setState({
            email: e.target.value
        });
    }
    handlepassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    render() {
        let validation = this.submitted ?                         // if the form has been submitted at least once
            this.validator.validate(this.state) :   // then check validity every time we render
            this.state.validation;
        let form = (
            <Form>
                <Form.Field>
                    <input placeholder='Email Address' onChange={this.handleemail} />
                </Form.Field >
                <Form.Field>
                    <input type="password" placeholder='Passowrd' onChange={this.handlepassword} />
                </Form.Field>
                <Form.Field>
                    <Button onClick={this.handleClose} inverted type="submit" className="fluid ui blue button">
                        Log In</Button>
                </Form.Field>
            </Form>);
        return (
            <div>

                <Modal
                    trigger={<Button inverted color='blue' onClick={this.handleOpen}>LogIn</Button>}
                    open={this.props.loginstate}
                    onClose={this.handleClose}
                    size='small' >
                    <div className="content one column stackable center aligned page grid">
                        <Modal.Content>
                            {form}
                        </Modal.Content>

                        <div className="text center form-footer">
                            <a>Forgot your Password?</a>
                            <p>Haven't got an Account?<a onClick={this.handlesignupopen}>SignUp</a></p>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default LogIn;