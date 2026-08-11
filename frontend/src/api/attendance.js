import api from "./axios";


export const getAttendance = async (date) => {
  const response = await api.get("/attendance", {
    params: {
      target_date: date,
    },
  });

  return response.data;
};


export const markBulkAttendance = async (
  date,
  attendance
) => {
  const response = await api.post("/attendance/bulk", {
    date,
    attendance,
  });

  return response.data;
};


export const updateAttendance = async (
  attendanceId,
  status
) => {
  const response = await api.put(
    `/attendance/${attendanceId}`,
    null,
    {
      params: {
        status,
      },
    }
  );

  return response.data;
};