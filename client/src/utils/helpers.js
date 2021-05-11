import { isEmailExist } from "../services/userService";
import { isClusterExist } from "../services/requestService";

export function alreadyExist(msg) {
  return this.test({
    name: "alreadyExist",
    exclusive: true,
    message: msg || "must be a valid email",
    test: async function (value) {
      const response = await isEmailExist(value);
      if (response && response.success && response.data) {
        return !response.data.exists;
      }
    },
  });
}
export function clusterExists(msg) {
  return this.test({
    name: "clusterExists",
    exclusive: true,
    message: msg || "must be a valid name",
    test: async function (value) {
      const response = await isClusterExist(value);
      if (response && response.success && response.data) {
        return !response.data.exists;
      }
    },
  });
}

export function getLocalDateTime(dateAndTime) {
  if (dateAndTime) {
    return new Date(dateAndTime).toLocaleString();
  }
}
