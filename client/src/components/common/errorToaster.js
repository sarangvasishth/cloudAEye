import React from "react";

const ErrorToaster = (props) => {
  return (
    <div
      className="alert text-center alert-danger text-dark fade show w-screen border"
      role="alert"
    >
      {props.message}
    </div>
  );
};
export default ErrorToaster;
