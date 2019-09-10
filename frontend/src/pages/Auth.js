import React, {Component} from 'react'
import './Auth.css';
import AuthContext from '../context/auth-context'

class AuthPage extends Component {
    state = {
        isLogin: false
    };
    static  contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    SingUpHandler = () => {
        /*this.setState(request => {
            return {isLogin: !request.isLogin}
        });*/
        this.setState({isLogin: !this.state.isLogin});

    };

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const pass = this.passwordEl.current.value;
        if (email.trim().length === 0 || pass.trim().length === 0) {
            return;
        }
        let requestBody = {
            query: `
                query{
                  login(email:"${email}",password:"${pass}"){
                     userId
                     token
                     tokenExpiration
                    } 
                }
            `
        };

        if (this.state.isLogin)
            requestBody = {
                query: `
                  mutation{
                      createUser(userInput:{email:"${email}", password:"${pass}"}){
                      _id
                      email
                      }
                  }
              `
            };
        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw  new Error("Failed!");
            }
            return res.json();
        }).then(resData => {
            if (resData.data.login.token) {
                this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration);
            }
        }).catch((err) => {
            throw err;
        })
    };

    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailEl}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={this.SingUpHandler}> Switch to
                        {this.state.isLogin ? " SignUp" : " Login"}
                    </button>
                    <button type="submit"> Submit</button>
                </div>
            </form>
        );
    }


}

export default AuthPage;
