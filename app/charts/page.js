'use client';
import { useEffect, useState } from 'react';
import CardLayout from '../../components/CardLayout';
import dynamic from 'next/dynamic';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

export default function ChartsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [map, setMap] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch posts
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();

        // Fetch comments
        const commentsResponse = await fetch('https://jsonplaceholder.typicode.com/comments');
        if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsResponse.json();

        // Update stats
        setStats({
          users: usersData.length,
          posts: postsData.length,
          comments: commentsData.length
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
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

  // Chart options
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['Users', 'Posts', 'Comments'],
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B'],
    title: {
      text: 'Platform Statistics',
      align: 'center',
      style: {
        fontSize: '20px',
        color: '#fff'
      }
    }
  };

  const chartSeries = [{
    name: 'Count',
    data: [stats.users, stats.posts, stats.comments]
  }];

  return (
    <CardLayout>
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Platform Statistics</h1>
      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-400">Error: {error}</div>}

      {/* Statistics Chart */}
      <div className="bg-white rounded-lg p-4 mb-6">
        {typeof window !== 'undefined' && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={350}
          />
        )}
      </div>

      {/* User Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {users.map((user) => (
          <Button
            key={user.id}
            onClick={() => handleUserClick(user)}
            variant="outline"
            className="h-auto p-4 text-left justify-start"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                  <div key={post.id} className="border-t pt-4">
                    <h4 className="font-medium text-gray-900">{post.title}</h4>
                    <p className="text-gray-700 mt-2">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </CardLayout>
  );
} 

