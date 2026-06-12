import { useEffect, useState } from "react";
import API from "../../services/api";

const UniversityCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/university/campaigns");
      setCampaigns(res.data.campaigns);
    };

    fetch();
  }, []);

  return (
    <div>
      <h2>University Campaigns</h2>

      {campaigns.map((campaign) => (
        <div key={campaign._id}>
          {campaign.title} - {campaign.status}
        </div>
      ))}
    </div>
  );
};

export default UniversityCampaigns;