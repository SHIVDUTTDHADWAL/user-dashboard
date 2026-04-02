import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Posts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (id) {
      api.getPosts(id).then((data) => {
        setPosts(data);
      });
    }
  }, [id]);

  return (
    <div className="container">
      <h2>Posts of User {id}</h2>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.title}</h3>
            <p>{p.body}</p>

           <button
  className="btn primary"
  onClick={() => navigate(`/comments/${p.id}`)}
>
  View Comments
</button>
          </div>
        ))
      )}
    </div>
  );
}