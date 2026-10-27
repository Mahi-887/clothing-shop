/** @type {import('next').NextConfig} */
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'clothing-shop';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubActions ? `/${repoName}` : '',
  assetPrefix: isGitHubActions ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com', 'res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
};

module.exports = nextConfig;
