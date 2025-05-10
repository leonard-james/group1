import Link from 'next/link';
import '@/app/globals.css';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-green-100 pt-16 flex justify-center">
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-16 w-full max-w-5xl flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">Dynamic Web Application</h1>
        <p className="text-gray-300 text-center mb-2">Built with Next.js and Tailwind CSS</p>
        <p className="text-gray-200 text-center mb-8">Explore users, posts, and analytics.</p>
        <div className="flex flex-row gap-8 w-full justify-center">
          <Link href="/users" passHref legacyBehavior>
            <a className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg">Users</a>
          </Link>
          <Link href="/posts" passHref legacyBehavior>
            <a className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg">Posts</a>
          </Link>
          <Link href="/charts" passHref legacyBehavior>
            <a className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow transition-colors text-lg">Charts</a>
          </Link>
        </div>
      </div>
    </main>
  );
}