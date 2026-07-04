import { Activity, CheckCircle2, Clock3, ListTodo, TimerReset, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardCharts from "../components/dashboard/DashboardCharts.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { getErrorMessage } from "../services/api.js";
import { getStats } from "../services/dashboardService.js";
import { formatDateTime } from "../utils/date.js";
import styles from "./Dashboard.module.css";

const defaultCards = {
  total: 0,
  completed: 0,
  pending: 0,
  inProgress: 0,
  overdue: 0,
  completionPercentage: 0,
  completionStreak: 0
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (isLoading) {
    return <Spinner label="Loading dashboard" />;
  }

  if (error) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        message={error}
        action={
          <Button type="button" onClick={loadStats}>
            Retry
          </Button>
        }
      />
    );
  }

  const cards = stats?.cards || defaultCards;

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Dashboard</p>
          <h1>Productivity Overview</h1>
        </div>
        <div className={styles.score}>
          <TrendingUp size={20} />
          <span>{cards.completionPercentage}% complete</span>
        </div>
      </section>

      <section className={styles.cardsGrid}>
        <StatCard label="Total Tasks" value={cards.total} icon={<ListTodo size={22} />} tone="blue" />
        <StatCard label="Completed" value={cards.completed} icon={<CheckCircle2 size={22} />} tone="green" />
        <StatCard label="Pending" value={cards.pending} icon={<Clock3 size={22} />} tone="amber" />
        <StatCard label="In Progress" value={cards.inProgress} icon={<Activity size={22} />} tone="violet" />
        <StatCard label="Overdue" value={cards.overdue} icon={<TimerReset size={22} />} tone="red" />
      </section>

      <section className={styles.insights}>
        <article>
          <span>Completion Percentage</span>
          <strong>{cards.completionPercentage}%</strong>
          <div className={styles.progressTrack}>
            <div style={{ width: `${cards.completionPercentage}%` }} />
          </div>
        </article>
        <article>
          <span>Completion Streak</span>
          <strong>{cards.completionStreak} days</strong>
          <p>Completed activity today keeps the streak alive.</p>
        </article>
      </section>

      <DashboardCharts charts={stats?.charts} />

      <section className={styles.activityPanel}>
        <header>
          <h3>Activity Log</h3>
        </header>
        {stats?.recentActivity?.length ? (
          <div className={styles.activityList}>
            {stats.recentActivity.map((item) => (
              <div key={item._id} className={styles.activityItem}>
                <span />
                <div>
                  <strong>{item.message}</strong>
                  <small>{formatDateTime(item.createdAt)}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No recent activity" />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
