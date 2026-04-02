import { useEffect, useState } from "react";
import { api } from "../api";
import UserForm from "../components/UserForm";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.getUsers().then((data) => {
      const local = JSON.parse(localStorage.getItem("users")) || [];
      setUsers([...local, ...data]);
    });
  }, []);

  const handleSubmit = (data) => {
    const newUser = { id: Date.now(), ...data };
    const updated = [newUser, ...users];

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  // 🔥 STRONG SEARCH
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.phone, u.city || u.address?.city]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="title">User Management</h1>

      {/* TOP BAR */}
      <div className="top-bar">
        <input
          className="search"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {showForm && (
        <UserForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
      )}

      {/* LIST */}
      {filteredUsers.length === 0 ? (
        <p className="no-result">No matching results found</p>
      ) : (
        filteredUsers.map((user) => (
          <div key={user.id} className="row">
            <div className="info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{user.city || user.address?.city}</p>
            </div>

            {/* 3 DOT MENU */}
            <div className="menu">
              <button onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}>
                ⋮
              </button>

              {menuOpen === user.id && (
                <div className="dropdown">
                  <button onClick={() => navigate(`/user/${user.id}`)}>
                    View
                  </button>
                  <button onClick={() => navigate(`/posts/${user.id}`)}>
                    Posts
                  </button>
                  <button onClick={() => navigate(`/albums/${user.id}`)}>
                    Albums
                  </button>
                  <button onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}