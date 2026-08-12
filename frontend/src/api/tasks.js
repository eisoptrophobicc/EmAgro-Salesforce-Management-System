import api from "./axios";


export const getTasks = async () => {
  const response = await api.get("/tasks");

  return response.data;
};


export const getTask = async (taskId) => {
  const response = await api.get(
    `/tasks/${taskId}`
  );

  return response.data;
};


export const createTask = async (data) => {
  const response = await api.post(
    "/tasks",
    data
  );

  return response.data;
};


export const updateTask = async (
  taskId,
  data
) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
};


export const updateTaskStatus = async (
  taskId,
  isActive
) => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    {
      is_active: isActive,
    }
  );

  return response.data;
};