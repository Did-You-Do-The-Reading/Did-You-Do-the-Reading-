import React, { Component } from 'react'
import { Form, Input, Button, Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { logInStudentThunk, signUpStudentThunk } from '../store'
import firebase from '../../server/firebase'
import history from '../history'


export class FirebaseAuth extends Component {

  constructor(){
    super()
    this.state = {
      email: '',
      password: ''
    }
  }

  inputEmail = (evt) => {
    console.log(evt.target.value)
    this.setState({email: evt.target.value})
  }

  inputPassword = (evt) => {
    console.log(evt.target.value)
    this.setState({password: evt.target.value})
  }

  login = (evt) => {
    evt.preventDefault();
    console.log('you clicked login!')
    this.props.logInStudentThunk(this.state.email, this.state.password);
  }

  signup = (evt) => {
    evt.preventDefault();
    console.log('you clicked signup!')
    this.props.signUpStudentThunk(this.state.email, this.state.password);
  }

  logout = (evt) => {
    evt.preventDefault();
    firebase.auth().signOut();
    history.push(`/`)
  }

  render(){

    return(
      <Container>
        {
          this.props.firebaseUser.uid ?
          <Container>
            <Button onClick={() => history.push(`/join`)}>Join A Game</Button>
            <Button onClick={this.logout}>Log Out</Button>
          </Container> :
          <Form>
            <Form.Field>
              <label>Email</label>
              <input onChange={this.inputEmail} placeholder='email' />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input onChange={this.inputPassword} placeholder='password' />
            </Form.Field>
            <Button onClick={this.login}>Log In</Button>
            <Button onClick={this.signup}>Sign Up</Button>
          </Form>
        }
      </Container>

    )
  }


}


const mapDispatch = {logInStudentThunk, signUpStudentThunk}

const mapState = state => {
  return {
    firebaseUser: state.firebaseUser
  }
}

export default connect(mapState, mapDispatch)(FirebaseAuth)