'use client';
import { useEffect, useState } from 'react';
import CardLayout from '../../components/CardLayout';
import { Button } from '@/components/ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    setLoading(true);

    try {
      // Fetch user's posts
      const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
      if (!postsResponse.ok) throw new Error('Failed to fetch user posts');
      const postsData = await postsResponse.json();
      setUserPosts(postsData);

      // Initialize map after a short delay to ensure the container is rendered
      setTimeout(() => {
        if (map) map.remove();
        const newMap = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [0, 0], // Default center
          zoom: 2
        });

        // Geocode the address
        const address = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              newMap.setCenter([lng, lat]);
              newMap.setZoom(12);

              // Add marker
              new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${user.name}</h3><p>${address}</p>`))
                .addTo(newMap);
            }
          });

        setMap(newMap);
      }, 100);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    setShowPostDetails(true);
    setLoading(true);
    setPostComments([]); // Clear previous comments

    try {
      const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
      if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
      const commentsData = await commentsResponse.json();
      // Sort comments by ID to maintain consistent order
      setPostComments(commentsData.sort((a, b) => a.id - b.id));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <CardLayout>
      <h2 className="text-2xl font-bold text-white mb-4">User List</h2>
      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-400">Error: {error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Button
            key={user.id}
            onClick={() => handleUserClick(user)}
            variant="outline"
            className="h-auto p-4 text-left justify-start bg-white hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </Button>
        ))}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
              <Button
                onClick={() => setShowUserDetails(false)}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">User Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Username:</span> {selectedUser.username}</p>
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedUser.phone}</p>
                  <p><span className="font-medium">Website:</span> {selectedUser.website}</p>
                </div>

                <h3 className="text-lg font-semibold mt-4 mb-3">Address</h3>
                <div className="space-y-2">
                  <p>{selectedUser.address.street}, {selectedUser.address.suite}</p>
                  <p>{selectedUser.address.city}, {selectedUser.address.zipcode}</p>
                </div>

                <h3 className="text-lg font-semibold mt-4 mb-3">Company</h3>
                <div className="space-y-2">
                  <p className="font-medium">{selectedUser.company.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.company.catchPhrase}</p>
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div id="map" className="h-64 rounded-lg"></div>
              </div>
            </div>

            {/* User Posts */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Posts</h3>
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="border-t pt-4 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                    onClick={() => handlePostClick(post)}
                  >
                    <h4 className="font-medium text-gray-900">{post.title}</h4>
                    <p className="text-gray-700 mt-2 line-clamp-2">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      {showPostDetails && selectedPost && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Post #{selectedPost.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setShowPostDetails(false)}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{selectedPost.body}</p>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}
                </span>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {postComments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{comment.name}</h4>
                          <p className="text-sm text-gray-500">{comment.email}</p>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                          Comment #{comment.id}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mt-2">{comment.body}</p>
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