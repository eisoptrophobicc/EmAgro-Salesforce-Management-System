import api from "./axios";


export const getEmployeeTasks = async (
  employeeId
) => {
  const response = await api.get(
    `/employee-tasks/employee/${employeeId}`
  );

  return response.data;
};


export const assignTask = async (data) => {
  const response = await api.post(
    "/employee-tasks",
    data
  );

  return response.data;
};


export const unassignTask = async (
  employeeId,
  taskId
) => {
  await api.delete(
    `/employee-tasks/employee/${employeeId}/task/${taskId}`
  );
};