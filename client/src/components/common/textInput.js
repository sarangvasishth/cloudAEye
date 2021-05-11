export default function Index(props) {
  const { error, name, type, label, value, placeholder, inputChange } = props;
  return (
    <>
      <label htmlFor={name} className="block text-md font-medium text-gray-500">
        {label}
      </label>
      <input
        id={name}
        type={type || "text"}
        name={name}
        value={value}
        onChange={inputChange}
        placeholder={placeholder}
        className="block w-full mt-1 py-2 px-3 border-gray-300 shadow-md text-md rounded-md"
      />
      {error && (
        <p className="m-0 p-0 text-xs font-bold text-red-700">{error}</p>
      )}
    </>
  );
}
