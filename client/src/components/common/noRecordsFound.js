import notFound from "../../assets/not-found.png";

const NoRecordsFound = (props) => {
  const { displayText } = props;
  return (
    <div className="flex flex-column justify-content-center align-items-center mt-5">
      <img src={notFound} style={{ width: 72, height: 64 }} />
      <h3 className="text-dark mt-3 text-lg font-semibold">
        {displayText || "No records found."}
      </h3>
    </div>
  );
};

export default NoRecordsFound;
