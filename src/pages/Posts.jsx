import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Posts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    api
      .getPosts(id)
      .then((data) => {
        if (!mounted) return;
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setPosts([]);
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
          <p className="eyebrow">Posts</p>
          <h2 className="page-title">Posts of User {id}</h2>
          <p className="page-subtitle">Tap a post to open its comments</p>
        </div>

        <button className="secondary-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {loading ? (
        <p className="state-message">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="no-result">No posts found</p>
      ) : (
        <div className="stack">
          {posts.map((p) => (
            <div key={p.id} className="section-card">
              <h3 className="card-title">{p.title}</h3>
              <p className="card-body">{p.body}</p>

              <button
                className="btn primary"
                onClick={() => navigate(`/comments/${p.id}`)}
              >
                View Comments
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}