import { Line } from "react-chartjs-2";

const RevenueChart = ({ revenueData }) => {
  const data = {
    labels: revenueData?.labels || [],
    datasets: [
      {
        label: "Revenue",
        data: revenueData?.values || [],
      },
    ],
  };

  return <Line data={data} />;
};

export default RevenueChart;