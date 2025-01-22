/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	experimental: {
		typedRoutes: false,
		// Disable static page generation for dynamic routes
		workerThreads: false,
		cpus: 1
	},
	// used in the Dockerfile
	output: 'standalone',
	// Configure dynamic routes to be generated at runtime
	async generateStaticParams() {
		return [];
	},
};

export default nextConfig;
