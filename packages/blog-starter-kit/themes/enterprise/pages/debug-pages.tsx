import request from 'graphql-request';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

type DebugPageProps = {
	staticPages: Array<{
		id: string;
		title: string;
		slug: string;
		hidden: boolean;
	}>;
	posts: Array<{
		id: string;
		title: string;
		slug: string;
	}>;
	error?: string;
};

export default function DebugPages({ staticPages, posts, error }: DebugPageProps) {
	if (error) {
		return (
			<div className="min-h-screen bg-white dark:bg-black p-8">
				<Head>
					<title>Debug Pages - Error</title>
				</Head>
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Debug Pages - Error</h1>
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						<strong>Error:</strong> {error}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white dark:bg-black p-8">
			<Head>
				<title>Debug Pages</title>
			</Head>
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Debug Pages</h1>
				
				<div className="mb-8">
					<h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Static Pages ({staticPages.length})</h2>
					{staticPages.length === 0 ? (
						<p className="text-gray-600 dark:text-gray-400">No static pages found. Make sure you have created pages in your Hashnode dashboard.</p>
					) : (
						<div className="space-y-2">
							{staticPages.map((page) => (
								<div key={page.id} className="border border-gray-200 dark:border-gray-700 rounded p-4">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-medium text-black dark:text-white">{page.title}</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">Slug: {page.slug}</p>
										</div>
										<div className="flex items-center space-x-2">
											{page.hidden && (
												<span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Hidden</span>
											)}
											<a
												href={`/${page.slug}`}
												className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
											>
												View Page
											</a>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Posts ({posts.length})</h2>
					<div className="space-y-2">
						{posts.map((post) => (
							<div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded p-4">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium text-black dark:text-white">{post.title}</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">Slug: {post.slug}</p>
									</div>
									<a
										href={`/${post.slug}`}
										className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
									>
										View Post
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<DebugPageProps> = async () => {
	try {
		const endpoint = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
		const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

		if (!endpoint || !host) {
			return {
				props: {
					staticPages: [],
					posts: [],
					error: 'Missing environment variables: NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT or NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST',
				},
			};
		}

		// Fetch static pages
		const staticPagesQuery = `
			query StaticPagesByPublication($host: String!) {
				publication(host: $host) {
					staticPages(first: 50) {
						edges {
							node {
								id
								title
								slug
								hidden
							}
						}
					}
				}
			}
		`;

		// Fetch posts
		const postsQuery = `
			query PostsByPublication($host: String!, $first: Int!) {
				publication(host: $host) {
					posts(first: $first) {
						edges {
							node {
								id
								title
								slug
							}
						}
					}
				}
			}
		`;

		const [staticPagesData, postsData] = await Promise.all([
			request(endpoint, staticPagesQuery, { host }) as any,
			request(endpoint, postsQuery, { host, first: 20 }) as any,
		]);

		const staticPages = (staticPagesData.publication?.staticPages.edges ?? []).map((edge: any) => edge.node);
		const posts = (postsData.publication?.posts.edges ?? []).map((edge: any) => edge.node);

		return {
			props: {
				staticPages,
				posts,
			},
		};
	} catch (error) {
		console.error('Error fetching debug data:', error);
		return {
			props: {
				staticPages: [],
				posts: [],
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			},
		};
	}
};
