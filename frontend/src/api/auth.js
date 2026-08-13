import api from "./axios";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};


export const getSetupStatus = async () => {
  const response = await api.get(
    "/auth/setup-status"
  );

  return response.data;
};


export const setupAdmin = async (data) => {
  const response = await api.post(
    "/auth/setup-admin",
    data
  );

  return response.data;
};
