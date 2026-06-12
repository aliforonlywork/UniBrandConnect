import { useEffect, useState } from "react";
import API from "../../services/api";

const ApproveUniversities = () => {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/admin/universities/pending");
      setUniversities(res.data.universities);
    };
    fetch();
  }, []);

  const approve = async (id) => {
    await API.put(`/admin/universities/${id}/approve`);
    alert("Approved");
  };

  return (
    <div>
      <h2>Approve Universities</h2>

      {universities.map((uni) => (
        <div key={uni._id}>
          {uni.name}
          <button onClick={() => approve(uni._id)}>Approve</button>
        </div>
      ))}
    </div>
  );
};

export default ApproveUniversities;