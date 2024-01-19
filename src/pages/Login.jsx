import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { register, handleSubmit } = useForm();
  const [error,setError]=useState("")
  const navigate=useNavigate();



  const handleLogin =async ({email,passsword}) => {
    console.log("Email and password:",email,passsword);
    try {
      const response = await axios.post('http://localhost:9005/api/v1/users/login', {
        email,
        passsword
      });
      console.log(response);
      if (response){
      //also store user's data at redux toolkit
        if (response.isDonor)
        {
          navigate('/donor');
        }
        else {
          navigate('/volunteer');
        }
      }
      // navigate(`/register/${response.data.data.username}/${response.data.data.email}/${params.userId}`);
    } catch (error) {
      console.log(error);
      console.log("Error:",error.response.data.message);
      setError(error.response.data.message);
    }
    






  }
  return (
    <div className="flex justify-center items-center h-screen bg-[#f8c9c9]">
      <div className=" w-[20rem] md:w-[30rem] p-7 h-auto md:p-20 shadow-xl bg-white rounded-3xl">

        <h1 className="text-center text-3xl font-semibold ">Log In to Khana</h1>
        <hr className="border w-full h-1 bg-black my-4" />
        <div>

          <form action="" onSubmit={handleSubmit(handleLogin)}>
            <div>
              <label for="email" className="font-normal text-sm ml-2">Email:</label>
              <input type="email"
                className="border-2 w-full h-10 px-2 pl-2  border-[#01cc65] mb-1 rounded-xl p-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 focus:text-gray-900 focus:border-4"
                id="email" placeholder="Enter your Email"
                required
                {...register('email')}
              />
            </div>

            <div>
              <label for="password" className="font-normal text-sm ml-2"> Password:</label>
              <input type="password"
                className="border-2 w-full h-10 px-2 pl-2 border-[#01cc65] mb-1 rounded-xl focus:outline-none focus:ring-0 focus:border-gray-300 focus:text-gray-900 p-2 text-sm focus:border-4"
                id="passowrd " placeholder="Enter your Password" required
                {...register('password')}
              />
            </div>
            <div>
              <a href="forgetpassword.html" className="font-medium text-xs">Forget Password?</a>
            </div>




            <div>
              <button type="submit" value="login"
                className="align-middle select-none font-sans font-bold  text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] cursor-pointer active:shadow-none rounded-full  h-10 w-full mt-1"
              >Log-in</button>
            </div>
          </form>
          <div>
            <h2 className="text-center text-lg font-semibold  mt-1">OR</h2>
          </div>
          <div>
            <a href="">
              <button
                className="align-middle font-bold font-sans mt-1 p-2 text-center h-10 w-full bg-blue-700 text-white rounded-full focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none text-xs">Continue
                with Google
              </button>
            </a>
          </div>
          <div className="mt-2 md:flex text-center md:mx-10">
            <h2 className="  text-sm ">
              Don't have an Account!
            </h2>
            <div className="md:flex ml-1">
              <a href="" className="underline text-blue-600 text-sm ">Sign Up</a>
            </div>
          </div>
          <div className="Error">
              Error:{error}
          </div>


        </div>



      </div>
    </div>
  )
}

export default Login;