const BASE = "https://jsonplaceholder.typicode.com";

export const api = {
  getUsers: () => fetch(`${BASE}/users`).then(r => r.json()),
  getUser: (id) => fetch(`${BASE}/users/${id}`).then(r => r.json()),
  getPosts: (id) => fetch(`${BASE}/posts?userId=${id}`).then(r => r.json()),
  getComments: (id) => fetch(`${BASE}/comments?postId=${id}`).then(r => r.json()),
  getAlbums: (id) => fetch(`${BASE}/albums?userId=${id}`).then(r => r.json()),
  getPhotos: (id) => fetch(`${BASE}/photos?albumId=${id}`).then(r => r.json()),
};