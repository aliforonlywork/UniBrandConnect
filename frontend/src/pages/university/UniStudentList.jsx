import { useEffect, useState } from "react";
import API from "../../services/api";

const UniStudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/university/students");
        setStudents(res.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;

  return (
    <div>
      <h2>Student List</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>University</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.university || "N/A"}</td>
              <td>{student.status || "Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UniStudentList;