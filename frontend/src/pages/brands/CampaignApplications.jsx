import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

const CampaignApplications = () => {

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchApplications =
      async () => {

        try {

          const res =
            await API.get(
              "/applications"
            );

          setApplications(
            res.data.applications || []
          );

        } catch (error) {

          console.log(
            "Applications Error:",
            error
          );

        } finally {

          setLoading(false);
        }
      };

    fetchApplications();

  }, []);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <div>

      <h2>Campaign Applications</h2>

      {applications.length === 0 ? (

        <p>No applications found</p>

      ) : (

        applications.map((app) => (

          <div
            key={app._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >

            <h3>
              {app.studentName ||
               app.student?.name}
            </h3>

            <p>
              Status:
              {" "}
              {app.status}
            </p>

            <p>
              Campaign:
              {" "}
              {app.campaignTitle ||
               app.campaign?.title}
            </p>

            <p>
              Applied At:
              {" "}
              {
                new Date(
                  app.createdAt
                ).toLocaleDateString()
              }
            </p>

          </div>
        ))
      )}
    </div>
  );
};

export default CampaignApplications;