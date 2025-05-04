import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllBlogs from "./pages/AllBlogs"
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from './pages/BlogDetails';
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-blogs" element={<AllBlogs />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
