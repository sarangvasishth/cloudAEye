import { Select, TextInput } from "../common";
import { NODE_TYPE_OPTIONS } from "../../constants";

export default function Index(props) {
  const {
    errors,
    formValues,
    closeModal,
    textChange,
    submitModal,
    selectChange,
  } = props;

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-end">
        <div className="col-12 col-lg-6 p-0">
          <div className="card rounded-0 border-0 h-screen">
            <div className="card-header">
              <p className="text-xl pl-3 font-bold">Cluster Request Form</p>
            </div>
            <div className="card-body overflow-auto mt-5">
              <div className="grid grid-cols-2 gap-8 mx-12">
                <div>
                  <TextInput
                    name="name"
                    type="name"
                    label="Cluster name"
                    error={errors?.name}
                    value={formValues?.name}
                    inputChange={textChange}
                    placeholder="Enter cluster name"
                  />
                </div>
                <div>
                  <TextInput
                    name="nodes"
                    type="number"
                    label="Number of nodes"
                    error={errors?.nodes}
                    value={formValues?.nodes}
                    inputChange={textChange}
                    placeholder="Enter number of nodes"
                  />
                </div>
                <div>
                  <Select
                    name="nodeType"
                    label="Node type"
                    error={errors.nodeType}
                    options={NODE_TYPE_OPTIONS}
                    placeholder="Select node type"
                    selectChange={selectChange}
                    value={{
                      value: formValues.nodeType,
                      label: formValues.nodeType,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                type="submit"
                onClick={submitModal}
                className="bg-black text-white px-3 pt-1 pb-1 font-bold rounded"
              >
                Save
              </button>
              <button
                type="submit"
                onClick={closeModal}
                className="bg-gray-500 text-white px-3 pt-1 pb-1 font-bold rounded ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
