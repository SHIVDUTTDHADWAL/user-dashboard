import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Albums() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    api
      .getAlbums(id)
      .then((data) => {
        if (!mounted) return;
        setAlbums(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setAlbums([]);
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
          <p className="eyebrow">Albums</p>
          <h2 className="page-title">Albums of User {id}</h2>
          <p className="page-subtitle">Open an album to view photos</p>
        </div>

        <button className="secondary-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {loading ? (
        <p className="state-message">Loading albums...</p>
      ) : albums.length === 0 ? (
        <p className="no-result">No albums found</p>
      ) : (
        <div className="stack">
          {albums.map((a) => (
            <div key={a.id} className="section-card">
              <h3 className="card-title">{a.title}</h3>

              <button
                className="btn primary"
                onClick={() => navigate(`/photos/${a.id}`)}
              >
                View Photos
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}