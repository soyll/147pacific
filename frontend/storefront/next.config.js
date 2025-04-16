/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: "standalone",
	images: {
		unoptimized: true,
		domains: ['host.docker.internal', 'localhost', 'saleor-backend', '*'],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '**',
			},
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	experimental: {
		scrollRestoration: true,
		incrementalCacheHandlerPath: process.env.CACHE_HANDLER_PATH,
		typedRoutes: false,
		// Disable static page generation for dynamic routes
		workerThreads: false,
		cpus: 1
	},
	// used in the Dockerfile
	async generateStaticParams() {
		return [];
	},
};

module.exports = nextConfig;
