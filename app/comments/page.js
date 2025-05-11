'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch post details
        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
        if (!postResponse.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch comments
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}/comments`);
        if (!commentsResponse.ok) {
          throw new Error('Failed to fetch comments');
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        setError('Failed to load post details');
        console.error('Error fetching post details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading post details...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">{error || 'Post not found'}</div>
        <Link href="/posts" className="text-blue-600 hover:text-blue-800">
          ← Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/posts"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Posts
      </Link>
      
      <article className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          {post.body}
        </p>
      </article>

      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments</h2>
        <div className="grid gap-6">
          {comments.map((comment) => (
            <div 
              key={comment.id}
              className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{comment.name}</h3>
                <span className="text-sm text-gray-500">{comment.email}</span>
              </div>
              <p className="text-gray-600">{comment.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}