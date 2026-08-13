import api from "./axios";


export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};


export const getSubAdminDashboard = async (
  targetDate
) => {
  const response = await api.get(
    "/sub-admin/dashboard",
    {
      params: {
        target_date: targetDate,
      },
    }
  );

  return response.data;
};
