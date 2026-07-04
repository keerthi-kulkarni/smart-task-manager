import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CATEGORY_COLORS, STATUS_COLORS } from "../../utils/constants.js";
import EmptyState from "../ui/EmptyState.jsx";
import styles from "./DashboardCharts.module.css";

const hasValues = (data = []) => data.some((item) => item.value > 0);

const DashboardCharts = ({ charts }) => {
  const statusData = charts?.statusDistribution || [];
  const categoryData = charts?.categoryDistribution || [];

  return (
    <section className={styles.grid}>
      <article className={styles.panel}>
        <header>
          <h3>Task Status Distribution</h3>
        </header>
        {hasValues(statusData) ? (
          <ResponsiveContainer width="100%" height={310}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={104} paddingAngle={3}>
                {statusData.map((item) => (
                  <Cell key={item.name} fill={STATUS_COLORS[item.name] || "#64748b"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No status data" />
        )}
      </article>

      <article className={styles.panel}>
        <header>
          <h3>Category Distribution</h3>
        </header>
        {hasValues(categoryData) ? (
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={categoryData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {categoryData.map((item) => (
                  <Cell key={item.name} fill={CATEGORY_COLORS[item.name] || "#64748b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No category data" />
        )}
      </article>
    </section>
  );
};

export default DashboardCharts;
