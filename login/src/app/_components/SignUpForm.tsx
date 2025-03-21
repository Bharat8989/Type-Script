import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// Importing icons from react-icons
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from "react-icons/fa";

export const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSumbit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      let result = null; // Initialize the 'result' variable with a default value of null
      if (response.ok) {
        localStorage.setItem("jwt", data.token);
        result = await signIn("credentials", {
          redirect: false, // Prevents redirecting to the signIn page
          email: formData.email,
          password: formData.password,
          // You can add a callback URL if needed
          callbackUrl: callbackUrl,
        });
      }

      if (result?.error) {
        // Handle errors (e.g., display an error message)
        setErrorMessage(result.error);
      } else {
        if (result) {
          window.location.href = result.url || callbackUrl;
        } else {
          // Handle the case where result is undefined
          // For example, redirect to a default page or show an error message
          window.location.href = callbackUrl;
        }
      }
    } catch (error) {}
  };

  return (
    <div>
      <form onSubmit={handleSumbit} className="sign-up-form">
        <h2 className="title">Sign Up</h2>
        <div className="input-field flex items-center">
          <div className="ml-3">
            <FaUser />
          </div>
          <input
            type="text"
            placeholder="Username"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="input-field flex items-center">
          <div className="ml-3">
            <FaEnvelope />
          </div>

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-field flex items-center">
          <div className="ml-3">
            <FaLock />
          </div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <p className="error-message text-center text-red-600">{errorMessage}</p>
        <button type="submit" className="btn solid">
          Sign Up
        </button>
        <p className="social-text">Or Sign up with social platforms</p>
        <div className="social-media">
          <div
            className="social-icon"
            onClick={() => signIn("google", { callbackUrl })}
            style={{ cursor: "pointer" }}
          >
            <FaGoogle />
          </div>
          <div
            className="social-icon"
            onClick={() => signIn("github", { callbackUrl })}
            style={{ cursor: "pointer" }}
          >
            <FaGithub />
          </div>
        </div>
      </form>
    </div>
  );
};
