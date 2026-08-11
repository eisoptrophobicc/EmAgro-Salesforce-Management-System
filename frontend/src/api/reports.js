import api from "./axios";

export const getAttendanceReport = async (fromDate, toDate) => {
  const response = await api.get("/reports/attendance", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

  return response.data;
};

export const getProductivityReport = async (fromDate, toDate) => {
  const response = await api.get("/reports/productivity", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

  return response.data;
};

export const getEmployeeReport = async (fromDate, toDate) => {
  const response = await api.get("/reports/employees", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

  return response.data;
};