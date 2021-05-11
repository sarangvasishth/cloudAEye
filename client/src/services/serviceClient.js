const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  return headers;
};

const tryJson = async (res) => {
  try {
    return await res.json();
  } catch (_error) {
    return undefined;
  }
};

export const fetchPost = async (url, data) => {
  return await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const body = await tryJson(resp);
        throw new Error(body ? body.message : "Something went wrong");
      }
      return await resp.json();
    })
    .catch((err) => err);
};

export const fetchPut = async (url, data) => {
  return await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const body = await tryJson(resp);

        throw new Error(body ? body.message : "Something went wrong");
      }
      return await resp.json();
    })
    .catch((err) => err);
};

export const fetchGet = async (url) => {
  return await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const body = await tryJson(resp);
        throw new Error(body ? body.message : "Something went wrong");
      }
      return await resp.json();
    })
    .catch((err) => err);
};
