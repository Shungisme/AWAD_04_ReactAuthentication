import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { setAuthContext } from "../services/api";

const AuthInitializer = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    setAuthContext(auth);
  }, [auth]);

  return children;
};

export default AuthInitializer;
