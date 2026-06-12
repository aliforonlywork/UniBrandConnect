const RecentActivity = ({ activities }) => {
  return (
    <div>
      <h3>Recent Activity</h3>
      {activities?.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

export default RecentActivity;