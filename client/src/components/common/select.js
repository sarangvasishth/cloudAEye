import Select from "react-select";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? "1px solid #1E3A8A" : "0px",
  }),
  option: (base, state) => ({
    ...base,
    background: "#fff",
    color: "#212529",
    "&:hover": {
      backgroundColor: "#1E3A8A",
      color: "#fff",
    },
  }),
};

export default function Index(props) {
  const {
    name,
    label,
    value,
    error,
    options,
    placeholder,
    selectChange,
  } = props;
  return (
    <>
      <label htmlFor={name} className="block text-md font-medium text-gray-500">
        {label}
      </label>
      <Select
        id={name}
        name={name}
        value={value}
        options={options}
        onChange={selectChange}
        placeholder={placeholder}
        styles={customSelectStyles}
        className="block w-full mt-1 border-gray-300 shadow-md text-md rounded-md"
      />
      {error && (
        <p className="m-0 p-0 text-xs font-bold text-red-700">{error}</p>
      )}
    </>
  );
}
