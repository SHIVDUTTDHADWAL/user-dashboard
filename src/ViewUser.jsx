import { useLocation } from "react-router-dom";

function ViewUser() {
  const location = useLocation();
  const user = location.state;

  if (!user) {
    return <h2>No Data Found ❌</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Details</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
    </div>
  );
}

export default ViewUser;