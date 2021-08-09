import { Link } from "react-router-dom";
import Navbar from './Navbar';

const Login = () => {
    const loginButtonClicked = async (evt) => {
        evt.preventDefault();
        const email = evt.target.email.value;
        const password = evt.target.password.value;

        const response = await fetch(
            `http://localhost:3001/login`, 
            {
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                    email,
                    password,
                },
                body: JSON.stringify({ email, password }),
            }
        );
        const data = await response.json();
    }
    return (
        <div>
            <Navbar />
            <div className="row">
                <div className="col-4"></div>
                <div 
                    className="col-4 card" 
                    style={{ marginTop: 30 }}
                >
                    <form 
                        className="card-body"
                        onSubmit={loginButtonClicked}
                    >
                        <div className="mb-3">
                            <label 
                                htmlFor="exampleInputEmail1" className="form-label"
                            >                                    
                                Email address
                            </label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="exampleInputEmail1" 
                                placeholder="email address"
                            />
                        </div>
                        <div className="mb-3">
                            <label 
                                htmlFor="exampleInputPassword1" 
                                className="form-label"
                            >
                                Password
                            </label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="exampleInputPassword1"
                                placeholder="password" 
                            ></input>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ width: "100%" }} 
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;