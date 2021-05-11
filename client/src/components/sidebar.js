import { useHistory } from "react-router-dom";

export default function Sidebar() {
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };
  return (
    <div className="sidenav flex flex-col justify-between">
      <div>
        <a href="/">Active</a>
        <a href="/approved">Approved</a>
        <a href="/denied">Denied</a>
      </div>
      <div>
        <a onClick={logout} className="justify-self-end self-end bg-gray-500">
          Logout
        </a>
      </div>
    </div>
  );
}
