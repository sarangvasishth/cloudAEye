import { useState } from "react";
import { useHistory } from "react-router-dom";
import { string, object } from "yup";
import toaster from "toasted-notes";

import { loginUser } from "../services/userService";
import { TextInput, ErrorToaster } from "../components/common";

const defaultFormValues = {
  email: "",
  password: "",
};

const formSchema = object({
  email: string().email("Invalid email format.").required("Email is required."),
  password: string().required("Password is required."),
});
const validateFormSchema = (values) =>
  formSchema.validate(values, {
    abortEarly: false,
  });

export default function Index() {
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(defaultFormValues);

  const handleTextChange = (e) => {
    e.preventDefault();
    setFormValues((prevstate) =>
      Object.assign({}, prevstate, {
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formValues;
    try {
      await validateFormSchema(formValues);
      setErrors({});

      const response = await loginUser({ email, password });
      if (response && response.success && response.data) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("role", response?.data?.role);
        history.push("/");
      } else {
        toaster.notify(<ErrorToaster message={response.message} />, {
          duration: 4000,
          position: "top",
        });
      }
    } catch (err) {
      if (err && err.inner) {
        setErrors(
          err.inner.reduce((acc, currentValue) => {
            acc[currentValue.path] = currentValue.message;
            return acc;
          }, {})
        );
      } else {
        toaster.notify(<ErrorToaster message={err?.message} />, {
          duration: 4000,
          position: "top",
        });
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center">
      <div className="w-1/2 shadow-md bg-gray-100 rounded-md mt-20 pt-10 pb-20 px-20">
        <div className="mt-5">
          <TextInput
            name="email"
            type="email"
            label="Email"
            error={errors.email}
            value={formValues.email}
            placeholder="Enter email"
            inputChange={handleTextChange}
          />
        </div>
        <div className="mt-5">
          <TextInput
            name="password"
            type="password"
            label="Password"
            error={errors.password}
            value={formValues.password}
            placeholder="Enter password"
            inputChange={handleTextChange}
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <button
          onClick={handleLogin}
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Login
        </button>
      </div>
      <span className="text-sm mt-1">
        Don't have an account?
        <a href="/sign-up" className="ml-1">
          SignUp
        </a>
      </span>
    </div>
  );
}
