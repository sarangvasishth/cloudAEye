import { fetchGet, fetchPost } from "./serviceClient";

export const isClusterExist = async (name) => {
  return await fetchPost(
    `${process.env.REACT_APP_URL}/cluster/is-cluster-name-exists`,
    {
      name: name,
    }
  );
};

export const getRequests = async (page, searchText, status) => {
  let url = `${process.env.REACT_APP_URL}/cluster/cluster-request-active?page=${page}&status=${status}`;
  if (searchText) {
    url = `${url}&search=${searchText}`;
  }
  return await fetchGet(url);
};

export const createClusterRequest = async (body) => {
  return await fetchPost(
    `${process.env.REACT_APP_URL}/cluster/cluster-request`,
    body
  );
};
export const denyClusterRequest = async (id) => {
  return await fetchGet(
    `${process.env.REACT_APP_URL}/cluster/deny-cluster-request/${id}`
  );
};
export const approveClusterRequest = async (id) => {
  return await fetchGet(
    `${process.env.REACT_APP_URL}/cluster/approve-cluster-request/${id}`
  );
};
