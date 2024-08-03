import { jwtVerify } from "jose";
import { useNavigate } from "react-router-dom";

const SECRET_KEY = "this is a secret key";

export const useAuth = () => {
  const navigate = useNavigate();

  const verifyToken = async (token) => {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(SECRET_KEY);
    try {
      const { payload } = await jwtVerify(token, secretKey);
      return payload;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };

  const checkAuth = async () => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      return false;
    }

    const payload = await verifyToken(token);
    if (
      !payload ||
      payload.username !== "admin" ||
      payload.password !== "admin"
    ) {
      navigate("/");
      return false;
    }

    return true;
  };

  return { checkAuth };
};
