'use client';

import { useEffect, useState } from 'react';
import CardLayout from '../../components/CardLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    setShowModal(true);
    setLoadingComments(true);
    setPostComments([]);

    try {
      const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
      if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
      const commentsData = await commentsResponse.json();
      setPostComments(commentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <CardLayout>
      <h2 className="text-2xl font-bold text-white mb-4">List of Posts</h2>
      {error && <div className="text-red-400 mb-4">Error: {error}</div>}
      
      <div className="w-full max-w-2xl">
        <ul className="space-y-2">
          {currentPosts.map((post) => (
            <li 
              key={post.id}
              className="bg-white rounded-md p-2.5 cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded mt-0.5">
                  #{post.id}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors truncate">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8 bg-white/95 backdrop-blur-md rounded-lg p-4 shadow-sm">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white"
          >
            Previous
          </Button>
          
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "" : "bg-white"}
            >
              {index + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Post Details Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selectedPost.title}</h2>
              <Button
                onClick={() => setShowModal(false)}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="prose max-w-none bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700">{selectedPost.body}</p>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                  {postComments.length}
                </span>
              </h3>

              {loadingComments ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {postComments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{comment.name}</h4>
                        <span className="text-xs text-gray-500">({comment.email})</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CardLayout>
  );
}
