import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" >
      <div className="bg-base-200 p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Login to Lorem Ipsum</h2>
        
        {/* This paragraph is intended for error display */}
        <p className="text-red-500 mb-4" style={{ visibility: 'hidden' }}>
          Error message placeholder
        </p>

        {/* Google Sign-In */}
        <button className="btn btn-primary w-full mb-4">
          Sign in with Google
        </button>
        
        <p className="my-4 text-gray-300">or</p>
        
        {/* Email/Password Login */}
        <form className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            readOnly
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-4"
            readOnly
          />
          <button className="btn btn-primary w-full">
            Login
          </button>
        </form>

        {/* Navigate to sign-up page */}
        <p className="mt-4 text-gray-300">
          Don't have an account?{" "}
          <button className="btn btn-primary">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
