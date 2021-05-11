import React from "react";

const SuccessToaster = (props) => {
  return (
    <div
      role="alert"
      className="alert text-center alert-success text-dark fade show w-screen border"
    >
      {props.message}
    </div>
  );
};
export default SuccessToaster;
