import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AttendanceChart({ attendance }) {
  const data = [
    {
      status: "Present",
      total: attendance?.present ?? 0,
    },
    {
      status: "Absent",
      total: attendance?.absent ?? 0,
    },
    {
      status: "Half Day",
      total: attendance?.half_day ?? 0,
    },
    {
      status: "Leave",
      total: attendance?.leave ?? 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="status" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AttendanceChart;