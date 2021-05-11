import { UNDEFINED } from "../../constants";

export default function PermissionCheck(props) {
  const { roles } = props;
  let userRole;
  if (typeof window !== UNDEFINED) {
    userRole = localStorage.getItem("role");
  }

  return roles && roles.length > 0 && roles.includes(userRole)
    ? props.children
    : null;
}
