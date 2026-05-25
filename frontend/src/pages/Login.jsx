import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const user = await login(email, password);
            // Redirect based on role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/student");
            }
        } catch (err) {
            setError(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
            <div 
                className="card border-secondary text-light p-4 shadow-lg w-100" 
                style={{ 
                    maxWidth: "420px", 
                    background: "rgba(25, 25, 25, 0.85)", 
                    backdropFilter: "blur(8px)",
                    borderRadius: "15px"
                }}
            >
                <div className="text-center mb-4">
                    <span className="fs-1">⚡</span>
                    <h2 className="fw-bold mt-2 text-info">Welcome Back</h2>
                    <p className="text-secondary small">Please enter your credentials to login</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-danger bg-danger-subtle text-danger-emphasis py-2 px-3 small rounded" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div className="form-group">
                        <label className="text-secondary small mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-secondary small mb-1">Password</label>
                        <input 
                            type="password" 
                            className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-info text-dark fw-bold py-2 mt-2 rounded d-flex justify-content-center align-items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="text-center mt-4 pt-2 border-top border-secondary">
                    <span className="text-secondary small">Don't have an account? </span>
                    <Link to="/register" className="text-info fw-semibold text-decoration-none small hover-underline">
                        Create one here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
