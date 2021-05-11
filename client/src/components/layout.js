import Sidebar from "./sidebar";

export default function layout(props) {
  return (
    <div>
      <Sidebar />
      <div className="main">{props.children}</div>
    </div>
  );
}
