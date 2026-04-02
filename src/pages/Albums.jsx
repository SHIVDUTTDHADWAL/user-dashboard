import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Albums() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    api.getAlbums(id).then(setAlbums);
  }, [id]);

  return (
    <div className="container">
      <h2>Albums</h2>

      {albums.map((a) => (
        <div key={a.id} className="card">
          <p>{a.title}</p>

          <button
  className="btn primary"
  onClick={() => navigate(`/photos/${a.id}`)}
>
  View Photos
</button>
        </div>
      ))}
    </div>
  );
}