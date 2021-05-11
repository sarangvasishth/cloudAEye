import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { addMethod, string, object, number } from "yup";

import Modal from "react-modal";
import toaster from "toasted-notes";
import queryString from "query-string";

import RequestModal from "../components/modals/clusterRequest";
import {
  Spinner,
  RoleCheck,
  Pagination,
  ErrorToaster,
  SuccessToaster,
  NoRecordsFound,
} from "../components/common";

import searchIcon from "../assets/search.png";

import { getLocalDateTime, clusterExists } from "../utils/helpers";
import { ROLES, DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from "../constants";
import {
  getRequests,
  denyClusterRequest,
  createClusterRequest,
  approveClusterRequest,
} from "../services/requestService";

const customStyles = {
  content: {
    top: "0px",
    right: "0px",
    border: "none",
    padding: "0px",
    height: "100vh",
    overflowX: "auto",
    overflowY: "auto",
    background: "none",
  },
  overlay: {
    zIndex: 1000,
    background: "rgba(0, 0, 0, 0.75)",
  },
};

addMethod(string, "clusterExists", clusterExists);
const formSchema = object({
  name: string()
    .required("Cluster name is required.")
    .clusterExists("Cluster with this name already exists."),
  nodes: number()
    .required("Number of nodes are required.")
    .typeError("Number of nodes must be a number."),
  nodeType: string().required("Node type is required."),
});

const validateFormSchema = (values) =>
  formSchema.validate(values, {
    abortEarly: false,
  });

export default function Index(props) {
  const history = useHistory();
  const parsed = queryString.parse(props.location.search);
  const { page, search } = parsed;

  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState(search);
  const [activePage, setActivePage] = useState(page ? page : 1);

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({});
  const [modalLoader, setModalLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests(page);
    if (page && search) {
      history.push(`?page=${page}&search=${search}`);
    } else if (page && !search) {
      history.push(`?page=${page}`);
    } else if (!page && search) {
      history.push(`?page=1&search=${search}`);
    } else {
      history.push(`?page=1`);
    }
  }, []);

  const fetchRequests = async (page) => {
    setLoader(true);
    try {
      const response = await getRequests(page, searchText, "PENDING");
      if (response && response.success && response.data) {
        setLoader(false);
        setRequests(response?.data?.requests);
        setTotalCount(response?.data?.totalCount);
      } else {
        setLoader(false);
        toaster.notify(<ErrorToaster message={response?.message} />, {
          duration: 4000,
          position: "top",
        });
      }
    } catch (err) {
      setLoader(false);
      toaster.notify(<ErrorToaster message={err?.message} />, {
        duration: 4000,
        position: "top",
      });
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    fetchRequests(page);
    if (searchText) {
      history.push(`?page=${page}&search=${searchText}`);
    } else {
      history.push(`?page=${page}`);
    }
  };

  const handleSearch = async () => {
    setActivePage(DEFAULT_PAGE);
    fetchRequests(DEFAULT_PAGE);
    history.push(`?page=${DEFAULT_PAGE}&search=${searchText}`);
  };

  const handleSearchTextChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setErrors({});
    setFormValues({});
    setIsModalOpen(false);
  };

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
        nodeType: selectedOption.value,
      })
    );
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setModalLoader(true);
    try {
      await validateFormSchema(formValues);
      setErrors({});
      const response = await createClusterRequest(formValues);
      if (response && response.success && response.data) {
        handleCloseModal();
        setModalLoader(false);
        fetchRequests(DEFAULT_PAGE);
      } else {
        setModalLoader(false);
        toaster.notify(<ErrorToaster message={response.message} />, {
          duration: 4000,
          position: "top",
        });
      }
    } catch (err) {
      setModalLoader(false);
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

  const denyRequest = async (id) => {
    try {
      const response = await denyClusterRequest(id);
      if (response && response.success && response.data) {
        fetchRequests(DEFAULT_PAGE);
        toaster.notify(<SuccessToaster message={response?.message} />, {
          duration: 4000,
          position: "top",
        });
      } else {
        toaster.notify(<ErrorToaster message={response?.message} />, {
          duration: 4000,
          position: "top",
        });
      }
    } catch (err) {
      toaster.notify(<ErrorToaster message={err?.message} />, {
        duration: 4000,
        position: "top",
      });
    }
  };
  const approveRequest = async (id) => {
    try {
      const response = await approveClusterRequest(id);
      if (response && response.success && response.data) {
        fetchRequests(DEFAULT_PAGE);
        toaster.notify(<SuccessToaster message={response?.message} />, {
          duration: 4000,
          position: "top",
        });
      } else {
        toaster.notify(<ErrorToaster message={response?.message} />, {
          duration: 4000,
          position: "top",
        });
      }
    } catch (err) {
      toaster.notify(<ErrorToaster message={err?.message} />, {
        duration: 4000,
        position: "top",
      });
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} style={customStyles}>
        <RequestModal
          errors={errors}
          formValues={formValues}
          closeModal={handleCloseModal}
          textChange={handleTextChange}
          submitModal={handleSubmitModal}
          selectChange={handleSelectChange}
        />
      </Modal>

      <div className="row justify-content-center mx-0 px-0">
        <div className="col-12">
          <div>
            <nav className="navbar navbar-expand-lg my-0 d-flex align-items-center justify-content-between px-3 border-bottom bg-white shadow-sm">
              <div className="h4 navbar-title mb-0 text-black font-weight-normal">
                Active Requests
              </div>

              <ul className="navbar-nav">
                <li className="nav-item mr-2">
                  <div className="input-group mr-2">
                    <input
                      type="text"
                      value={searchText}
                      className="form-control py-0"
                      onChange={handleSearchTextChange}
                      placeholder="Search on cluster name..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <div>
                      <button
                        onClick={handleSearch}
                        className="bg-black text-white px-3 py-1 font-bold rounded"
                      >
                        <img src={searchIcon} width="23px" height="23px" />
                      </button>
                    </div>
                  </div>
                </li>
                <RoleCheck roles={[ROLES.DEVELOPMENT]}>
                  <li className="nav-item">
                    <div className="btn-group">
                      <a
                        href="#"
                        onClick={handleOpenModal}
                        className="bg-black text-white px-3 py-1 font-bold rounded"
                      >
                        Add
                      </a>
                    </div>
                  </li>
                </RoleCheck>
              </ul>
            </nav>
          </div>
        </div>

        {loader ? (
          <Spinner />
        ) : requests.length > 0 ? (
          <div className="col-10">
            <div className="card shadow-sm border-0 mt-3">
              <div className="card-body p-0 overflow-auto rounded">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr className="text-dark">
                        <th className="align-middle">Name</th>
                        <th className="align-middle">Nodes</th>
                        <th className="align-middle">Node Type</th>
                        <th className="align-middle">Status</th>
                        <th className="align-middle">Created by</th>
                        <th className="align-middle">Created at</th>
                        <RoleCheck roles={[ROLES.DEVOPS]}>
                          <th className="align-middle">Action</th>
                        </RoleCheck>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req._id}>
                          <td className="align-middle">{req.name}</td>
                          <td className="align-middle">{req.nodes}</td>
                          <td className="align-middle">{req.nodeType}</td>
                          <td className="align-middle">{req.status}</td>
                          <td className="align-middle">{req.createdBy}</td>
                          <td className="align-middle">
                            {getLocalDateTime(req.createdAt)}
                          </td>
                          <RoleCheck roles={[ROLES.DEVOPS]}>
                            <td className="align-middle">
                              <button
                                type="button"
                                onClick={() => approveRequest(req._id)}
                                className="btn btn-link text-decoration-none text-dark font-weight-bold"
                              >
                                Approve
                              </button>
                              |
                              <button
                                type="button"
                                onClick={() => denyRequest(req._id)}
                                className="btn btn-link text-decoration-none text-dark font-weight-bold"
                              >
                                Deny
                              </button>
                            </td>
                          </RoleCheck>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  totalCount={totalCount}
                  activePage={activePage}
                  pageChange={handlePageChange}
                  itemsCountPerPage={DEFAULT_ITEMS_PER_PAGE}
                />
              </div>
            </div>
          </div>
        ) : (
          <NoRecordsFound displayText="No active requests found!" />
        )}
      </div>
    </>
  );
}
