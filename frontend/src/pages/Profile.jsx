import { CalendarDays, CheckCircle2, Flame, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../components/dashboard/StatCard.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import { getStats } from "../services/dashboardService.js";
import { formatDate } from "../utils/date.js";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [stats, setStats] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        setStats(await getStats());
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoadingStats(false);
      }
    };

    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({ name });
      toast.success("Profile saved");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={styles.avatar}>
          <UserRound size={34} />
        </div>
        <div>
          <p className={styles.eyebrow}>Profile</p>
          <h1>{user?.name}</h1>
          <span>{user?.email}</span>
        </div>
      </section>

      <section className={styles.grid}>
        <form className={styles.panel} onSubmit={handleSubmit}>
          <h2>Account</h2>
          <Input label="Name" required value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Member Since" value={user?.createdAt ? formatDate(user.createdAt) : ""} disabled />
          <Button type="submit" isLoading={isSaving}>
            Save Profile
          </Button>
        </form>

        <section className={styles.panel}>
          <h2>Productivity</h2>
          {isLoadingStats ? (
            <Spinner label="Loading profile stats" />
          ) : (
            <div className={styles.statStack}>
              <StatCard
                label="Completed Tasks"
                value={stats?.cards?.completed || 0}
                icon={<CheckCircle2 size={22} />}
                tone="green"
              />
              <StatCard
                label="Completion Streak"
                value={`${stats?.cards?.completionStreak || 0} days`}
                icon={<Flame size={22} />}
                tone="amber"
              />
              <StatCard
                label="Total Tasks"
                value={stats?.cards?.total || 0}
                icon={<CalendarDays size={22} />}
                tone="blue"
              />
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default Profile;
