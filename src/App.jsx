import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";
import Posts from "./pages/Posts";
import Comments from "./pages/Comments";
import Albums from "./pages/Albums";
import Photos from "./pages/Photos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/:id" element={<UserDetails />} />
      <Route path="/posts/:id" element={<Posts />} />
      <Route path="/comments/:id" element={<Comments />} />
      <Route path="/albums/:id" element={<Albums />} />
      <Route path="/photos/:id" element={<Photos />} />
    </Routes>
  );
}