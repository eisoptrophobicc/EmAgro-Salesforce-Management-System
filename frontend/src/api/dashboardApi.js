import api from "./axios";


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