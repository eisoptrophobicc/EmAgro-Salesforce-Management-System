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

export const downloadAttendanceExcel = async (fromDate, toDate) => {
  const response = await api.get("/reports/attendance/excel", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  });

  return response.data;
};

export const downloadAttendancePdf = async (fromDate, toDate) => {
  const response = await api.get("/reports/attendance/pdf", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  });

  return response.data;
};

export const downloadProductivityExcel = async (fromDate, toDate) => {
  const response = await api.get("/reports/productivity/excel", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  });

  return response.data;
};

export const downloadProductivityPdf = async (fromDate, toDate) => {
  const response = await api.get("/reports/productivity/pdf", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  });

  return response.data;
};

export const downloadEmployeeExcel = async (fromDate, toDate) => {
  const response = await api.get("/reports/employees/excel", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  });

  return response.data;
};

export const downloadEmployeePdf = async (fromDate, toDate) => {
  const response = await api.get("/reports/employees/pdf", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
    responseType: "blob",
  });

  return response.data;
};