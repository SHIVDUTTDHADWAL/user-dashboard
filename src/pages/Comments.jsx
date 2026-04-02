import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Comments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    api
      .getComments(id)
      .then((data) => {
        if (!mounted) return;
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setComments([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="page-shell">
      <div className="page-head">
        <div>
          <p className="eyebrow">Comments</p>
          <h2 className="page-title">Comments for Post {id}</h2>
          <p className="page-subtitle">All comments loaded from the API</p>
        </div>

        <button className="secondary-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {loading ? (
        <p className="state-message">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="no-result">No comments found</p>
      ) : (
        <div className="stack">
          {comments.map((c) => (
            <div key={c.id} className="section-card">
              <h3 className="card-title">{c.name}</h3>
              <p className="card-body">{c.body}</p>
              <p className="card-meta">{c.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}