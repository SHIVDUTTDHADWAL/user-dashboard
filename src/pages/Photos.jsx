import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Photos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    if (id) {
      api
        .getPhotos(id)
        .then((data) => {
          if (!mounted) return;
          setPhotos(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          if (!mounted) return;
          setPhotos([]);
        })
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="page-shell">
      <div className="page-head">
        <div>
          <p className="eyebrow">Photos</p>
          <h2 className="page-title">Photos of Album {id}</h2>
          <p className="page-subtitle">Preview images in a clean grid</p>
        </div>

        <button className="secondary-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {loading ? (
        <p className="state-message">Loading photos...</p>
      ) : photos.length === 0 ? (
        <p className="no-result">No photos found</p>
      ) : (
        <div className="gallery">
          {photos.slice(0, 30).map((p) => (
            <div key={p.id} className="photo-card">
              <img src={p.thumbnailUrl} alt={p.title || "Photo"} />
              <div className="photo-caption">{p.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}