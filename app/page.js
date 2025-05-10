import Link from 'next/link';
import '@/app/globals.css';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">WebTech Final Project</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Users Section */}
          <Link href="/users" passHref>
            <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition cursor-pointer">
              <Button variant="contained" color="primary" fullWidth>
                Users
              </Button>
              <p className="text-gray-500 mt-4">Manage and view all users.</p>
            </div>
          </Link>

          {/* Posts Section */}
          <Link href="/posts" passHref>
            <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition cursor-pointer">
              <Button variant="contained" color="success" fullWidth>
                Posts
              </Button>
              <p className="text-gray-500 mt-4">Manage and view all users.</p>
              <p className="text-gray-500">Read and create posts.</p>
            </div>
          </Link>

          {/* Charts Section */}
          <Link href="/charts" passHref>
            <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition cursor-pointer">
              <Button variant="contained" color="secondary" fullWidth>
                Charts
              </Button>
              <p className="text-gray-500 mt-4">Manage and view all users.</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}import Link from 'next/link';
import '@/app/globals.css';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">WebTech Final Project</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Users Section */}
          <Link href="/users" passHref>
            <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition cursor-pointer">
              <Button variant="contained" color="primary" fullWidth>
                Users
              </Button>
              <p className="text-gray-500 mt-4">Manage and view all users.</p>
            </div>
          </Link>

          {/* Posts Section */}
          <Link href="/posts" passHref>
            <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition cursor-pointer">
              <Button variant="contained" color="success" fullWidth>
                Posts
              </Button>
              <p className="text-gray-500 mt-4">Manage and view all users.</p>
              <p className="text-gray-500">Read and create posts.</p>
            </div>
          </Link>

          {/* Charts Section */}
          <Link href="/charts" passHref>
            <div className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 transition cursor-pointer">
              <Button variant="contained" color="secondary" fullWidth>
                Charts
              </Button>
              <p className="text-gray-500 mt-4">Manage and view all users.</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}