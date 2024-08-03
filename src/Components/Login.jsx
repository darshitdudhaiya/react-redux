import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignJWT } from "jose";
import { useAuth } from "../utils/authUtils";

function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        navigate("/Dashboard");
      }
    };

    checkLoginStatus();

    document.title = "Login";
  }, []);


  const SECRET_KEY = "this is a secret key";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(SECRET_KEY);

    const token = await new SignJWT({ username, password })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secretKey);

    sessionStorage.setItem("jwtToken", token);
    navigate("/Dashboard");
  };

  return (
    <div className="bg-[#134B70] h-[100vh] flex items-center justify-center">
      <div>
        <div
          id="authentication-modal"
          tabIndex={-1}
          className="h-full w-screen max-h-full flex items-center justify-center"
        >
          <div className="relative p-4 w-full max-w-md max-h-full ">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 className="text-xl font-semibold text-gray-900 ">Login</h3>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Your username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="John Doe"
                      required=""
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Your password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                        required=""
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={submit}
                    type="submit"
                    className="w-full text-white bg-[#508C9B] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
