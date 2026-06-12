import axios from "axios";

const API = "http://localhost:5000/api/gamification";

// FORCE TEST LOG
console.log("GAMIFICATION API BASE:", API);

export const getLeaderboard = async () => {
  return await axios.get(
    `${API}/leaderboard`
  );
};

export const getMyGamification = async () => {
  const token =
    localStorage.getItem("token");

  return await axios.get(
    `${API}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};