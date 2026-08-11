import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ProductivityChart({ tasks = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={tasks}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="task" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ProductivityChart;