import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ActivityTimeline({ timeline = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timeline}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ActivityTimeline;