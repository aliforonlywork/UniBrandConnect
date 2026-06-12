import { useEffect, useState } from "react";
import API from "../../services/api";

const UniversityAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/university/analytics");
      setData(res.data);
    };

    fetch();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>University Analytics</h2>

      <p>Total Students: {data.totalStudents}</p>
      <p>Total Campaign Participation: {data.totalParticipation}</p>
      <p>Total Earnings: Rs {data.totalEarnings}</p>
    </div>
  );
};

export default UniversityAnalytics;