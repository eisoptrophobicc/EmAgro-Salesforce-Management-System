import api from "./axios";


export const getRoles = async () => {
  const response = await api.get("/roles");

  return response.data;
};


export const getUsers = async (params = {}) => {
  const response = await api.get("/users", {
    params,
  });

  return response.data;
};


export const createUser = async (data) => {
  const response = await api.post("/users", data);

  return response.data;
};


export const updateUser = async (userId, data) => {
  const response = await api.patch(
    `/users/${userId}`,
    data
  );

  return response.data;
};


export const updateUserStatus = async (
  userId,
  isActive
) => {
  const response = await api.patch(
    `/users/${userId}/status`,
    {
      is_active: isActive,
    }
  );

  return response.data;
};


export const resetUserPassword = async (
  userId,
  password
) => {
  const response = await api.patch(
    `/users/${userId}/reset-password`,
    {
      password,
    }
  );

  return response.data;
};
