import { addMethod, string, object } from "yup";
import { useState } from "react";
import toaster from "toasted-notes";
import { useHistory } from "react-router-dom";

import { ROLE_OPTIONS } from "../constants";
import { alreadyExist } from "../utils/helpers";
import { signUpUser } from "../services/userService";
import { Select, TextInput, ErrorToaster } from "../components/common";

const defaultFormValues = {
  email: "",
  password: "",
};

addMethod(string, "alreadyExist", alreadyExist);

const formSchema = object({
  email: string()
    .email("Invalid email format.")
    .required("Email is required.")
    .alreadyExist("An account with this email already exist."),
  password: string().required("Password is required."),
  role: string().required("User role is required."),
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

  const handleSelectChange = (selectedOption) => {
    setFormValues((prevstate) =>
      Object.assign({}, prevstate, {
        role: selectedOption.value,
      })
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { email, password, role } = formValues;
    try {
      await validateFormSchema(formValues);
      setErrors({});

      const response = await signUpUser({ email, password, role });
      if (response && response.success && response.data) {
        history.push("/login");
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
          <Select
            name="role"
            label="User Role"
            error={errors.role}
            options={ROLE_OPTIONS}
            placeholder="Select role"
            selectChange={handleSelectChange}
            value={{ value: formValues.role, label: formValues.role }}
          />
        </div>
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
          onClick={handleSignUp}
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
        >
          Sign up
        </button>
      </div>
      <span className="text-sm mt-1">
        Already have an account?
        <a href="/login" className="ml-1">
          Login
        </a>
      </span>
    </div>
  );
}
