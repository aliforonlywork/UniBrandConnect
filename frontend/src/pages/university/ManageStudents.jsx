import { useEffect, useState } from "react";
import API from "../../services/api";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/university/students");
      setStudents(res.data.students);
    };

    fetch();
  }, []);

  return (
    <div>
      <h2>Manage Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          {student.name} - {student.email}
        </div>
      ))}
    </div>
  );
};

export default ManageStudents;