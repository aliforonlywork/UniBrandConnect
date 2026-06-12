import { useEffect, useState } from "react";
import API from "../services/api";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      🔔 ({notifications.length})
    </div>
  );
};

export default NotificationBell;