import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "admin") return <Navigate to="/panel" replace />;

  return children;
};

export default AdminRoute;
