import cron from "node-cron";
import { sendTaskReminderEmails } from "../services/notificationService.js";

export const startNotificationCron = () => {
  console.log("✅ Notification scheduler started");

  cron.schedule("* * * * *", async () => {
    console.log("⏰ Cron fired:", new Date());

    try {
      await sendTaskReminderEmails(new Date());
      console.log("✅ Reminder check completed");
    } catch (error) {
      console.error("❌ Notification cron failed:", error);
    }
  });
};