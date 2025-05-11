
'use client';
import { useEffect, useState } from 'react';
import CardLayout from '../../components/CardLayout';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <CardLayout>
      <h2 className="text-2xl font-bold text-white mb-4">User List</h2>
      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-400">Error: {error}</div>}
      <ul className="w-full max-w-2xl">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="text-black font-medium">{user.name}</span>
            <span className="text-gray-900">{user.email}</span>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
}