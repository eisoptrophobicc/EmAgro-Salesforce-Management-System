import api from "./axios";


export const getTasks = async () => {
  const response = await api.get("/tasks");

  return response.data;
};


export const getEmployeeTasks = async (
  employeeId
) => {
  const response = await api.get(
    `/employee-tasks/employee/${employeeId}`
  );

  return response.data;
};


export const getDailyActivity = async (
  attendanceId
) => {
  const response = await api.get(
    `/daily-activities/${attendanceId}`
  );

  return response.data;
};


export const createDailyActivity = async (
  attendanceId,
  remarks,
  items
) => {
  const response = await api.post(
    "/daily-activities",
    {
      attendance_id: attendanceId,
      remarks: remarks || null,
      items,
    }
  );

  return response.data;
};