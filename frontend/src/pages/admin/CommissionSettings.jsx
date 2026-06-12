import { useEffect, useState } from "react";
import { getCommissionSettings, updateCommission } from "../../services/commissionService";

const CommissionSettings = () => {
  const [commission, setCommission] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const res = await getCommissionSettings();
      setCommission(res.data.percentage);
    };
    fetch();
  }, []);

  const save = async () => {
    await updateCommission({ percentage: commission });
    alert("Updated");
  };

  return (
    <div>
      <h2>Commission Settings</h2>

      <input
        type="number"
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
      />

      <button onClick={save}>Save</button>
    </div>
  );
};

export default CommissionSettings;