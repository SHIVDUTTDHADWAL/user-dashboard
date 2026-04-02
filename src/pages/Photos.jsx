import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function Photos() {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (id) {
      api.getPhotos(id).then((data) => {
        setPhotos(data);
      });
    }
  }, [id]);

  return (
    <div className="container">
      <h2>Photos</h2>

      {photos.length === 0 ? (
        <p>No photos found</p>
      ) : (
        <div className="grid">
          {photos.slice(0, 30).map((p) => (
            <img
              key={p.id}
              src={p.thumbnailUrl}
              alt="img"
            />
          ))}
        </div>
      )}
    </div>
  );
}