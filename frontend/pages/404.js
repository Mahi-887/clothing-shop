import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl mb-6">🔍</p>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-500 mb-8">Oops! Page not found.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
