import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("users")) || [];
    const found = local.find(u => u.id == id);

    if (found) setUser(found);
    else api.getUser(id).then(setUser);
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>City: {user.city || user.address?.city}</p>

      <div className="action-buttons">
  <button
    className="btn primary"
    onClick={() => navigate(`/posts/${id}`)}
  >
    View Posts
  </button>

  <button
    className="btn secondary"
    onClick={() => navigate(`/albums/${id}`)}
  >
    View Albums
  </button>
</div>
      </div>
    </div>
  );
}