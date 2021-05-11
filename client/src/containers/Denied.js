import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import toaster from "toasted-notes";
import queryString from "query-string";

import {
  Spinner,
  Pagination,
  ErrorToaster,
  NoRecordsFound,
} from "../components/common";

import searchIcon from "../assets/search.png";

import { getLocalDateTime } from "../utils/helpers";
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from "../constants";
import { getRequests } from "../services/requestService";

export default function Index(props) {
  const history = useHistory();
  const parsed = queryString.parse(props.location.search);
  const { page, search } = parsed;

  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState(search);
  const [activePage, setActivePage] = useState(page ? page : 1);

  useEffect(() => {
    fetchRequests(page);
    if (page && search) {
      history.push(`/denied?page=${page}&search=${search}`);
    } else if (page && !search) {
      history.push(`/denied?page=${page}`);
    } else if (!page && search) {
      history.push(`/denied?page=1&search=${search}`);
    } else {
      history.push(`/denied?page=1`);
    }
  }, []);

  const fetchRequests = async (page) => {
    setLoader(true);
    try {
      const response = await getRequests(page, searchText, "DENIED");
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
      history.push(`/denied?page=${page}&search=${searchText}`);
    } else {
      history.push(`/denied?page=${page}`);
    }
  };

  const handleSearch = async () => {
    setActivePage(DEFAULT_PAGE);
    fetchRequests(DEFAULT_PAGE);
    history.push(`/denied?page=${DEFAULT_PAGE}&search=${searchText}`);
  };

  const handleSearchTextChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  return (
    <>
      <div className="row justify-content-center mx-0 px-0">
        <div className="col-12">
          <div>
            <nav className="navbar navbar-expand-lg my-0 d-flex align-items-center justify-content-between px-3 border-bottom bg-white shadow-sm">
              <div className="h4 navbar-title mb-0 text-black font-weight-normal">
                Denied Requests
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
          <NoRecordsFound displayText="No denied requests found!" />
        )}
      </div>
    </>
  );
}
