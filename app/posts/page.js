'use client';

import { useEffect, useState } from 'react';
import CardLayout from '../../components/CardLayout';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

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

  return (
    <CardLayout>
      <h2 className="text-2xl font-bold text-white mb-4">List of Posts</h2>
      <ul className="w-full max-w-2xl">
        {posts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <li className="bg-white rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
            </li>
          </Link>
        ))}
      </ul>
    </CardLayout>
  );
}
