import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const readUsersFromStorage = () => {
  const raw = localStorage.getItem("users");
  if (raw === null) return null;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
};

const formatAddress = (user) => {
  if (!user) return "";

  const apiAddress = user.address
    ? [user.address.suite, user.address.street, user.address.city, user.address.zipcode]
        .filter(Boolean)
        .join(", ")
    : "";

  const customAddress = [user.city, user.state, user.country]
    .filter(Boolean)
    .join(", ");

  return apiAddress || customAddress || "—";
};

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      setLoading(true);
      setError("");

      const storedUsers = readUsersFromStorage();

      if (storedUsers !== null) {
        const found = storedUsers.find((u) => String(u.id) === String(id));

        if (!mounted) return;

        if (found) {
          setUser(found);
        } else {
          setUser(null);
          setError("User not found in saved data.");
        }

        setLoading(false);
        return;
      }

      try {
        const data = await api.getUser(id);

        if (!mounted) return;

        if (data && data.id) {
          setUser(data);
        } else {
          setUser(null);
          setError("User not found.");
        }
      } catch {
        if (!mounted) return;
        setUser(null);
        setError("Unable to load user.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell">
        <p className="state-message">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell">
        <div className="section-card">
          <p className="no-result">{error || "No data found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="section-card">
        <div className="page-head">
          <div>
            <p className="eyebrow">User profile</p>
            <h2 className="page-title">{user.name}</h2>
            <p className="page-subtitle">Details and navigation actions</p>
          </div>

          <button className="secondary-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <p>{user.email || "—"}</p>
          </div>

          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <p>{user.phone || "—"}</p>
          </div>

          <div className="detail-item">
            <span className="detail-label">Address</span>
            <p>{formatAddress(user)}</p>
          </div>

          <div className="detail-item">
            <span className="detail-label">Location</span>
            <p>{[user.city, user.state, user.country].filter(Boolean).join(", ") || "—"}</p>
          </div>
        </div>

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