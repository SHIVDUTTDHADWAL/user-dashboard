import { useEffect, useState } from "react";
import { api } from "../api";
import UserForm from "../components/UserForm";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "users";
const PAGE_SIZE = 5;

const readUsersFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
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

const searchableText = (user) => {
  return [
    user?.name,
    user?.email,
    user?.phone,
    formatAddress(user),
    user?.username,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export default function Home() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = readUsersFromStorage();

    if (stored !== null) {
      setUsers(stored);
      setLoading(false);
      return;
    }

    let mounted = true;

    api
      .getUsers()
      .then((data) => {
        if (!mounted) return;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setUsers([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users, loading]);

  useEffect(() => {
    setPage(1);
    setMenuOpen(null);
  }, [search]);

  const handleSubmit = (data) => {
    const newUser = {
      id: String(Date.now()),
      ...data,
    };

    setUsers((prev) => [newUser, ...prev]);
    setShowForm(false);
    setMenuOpen(null);
    setPage(1);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => String(user.id) !== String(id)));
    setMenuOpen(null);
  };

  const query = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) =>
    searchableText(user).includes(query)
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setMenuOpen(null);
  }, [page]);

  const emptyMessage = query
    ? "No matching results found"
    : "No users found";

  return (
    <div className="container">
      <h1 className="title">User Management</h1>

      <div className="top-bar">
        <div className="search-wrap">
          <input
            className="search"
            placeholder="Search by name, email, phone, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search ? (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          ) : null}
        </div>

        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {showForm && (
        <UserForm
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {loading ? <p className="state-message">Loading users...</p> : null}

      {!loading && filteredUsers.length === 0 ? (
        <p className="no-result">{emptyMessage}</p>
      ) : null}

      {!loading &&
        visibleUsers.map((user) => (
          <div key={user.id} className="row">
            <div className="info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{formatAddress(user)}</p>
            </div>

            <div className="menu">
              <button
                className="menu-trigger"
                onClick={() =>
                  setMenuOpen(menuOpen === user.id ? null : user.id)
                }
                aria-label="Open user actions"
              >
                ⋮
              </button>

              {menuOpen === user.id ? (
                <div className="dropdown">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/user/${user.id}`);
                      setMenuOpen(null);
                    }}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/posts/${user.id}`);
                      setMenuOpen(null);
                    }}
                  >
                    Posts
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/albums/${user.id}`);
                      setMenuOpen(null);
                    }}
                  >
                    Albums
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}

      {!loading && filteredUsers.length > 0 && totalPages > 1 ? (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>

          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}