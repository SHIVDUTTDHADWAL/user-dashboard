import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api.getComments(id).then(setComments);
  }, [id]);

  return (
    <div className="container">
      <h2>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments found</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="card">
            <b>{c.name}</b>
            <p>{c.body}</p>
          </div>
        ))
      )}
    </div>
  );
}