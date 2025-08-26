import { resizeImage } from '@starter-kit/utils/image';
import request from 'graphql-request';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Container } from '../../components/container';
import { AppProvider } from '../../components/contexts/appContext';
import { CoverImage } from '../../components/cover-image';
import { Footer } from '../../components/footer';
import { Header } from '../../components/header';
import { Layout } from '../../components/layout';
import { MorePosts } from '../../components/more-posts';
import {
	PostFragment,
	PublicationFragment,
	SeriesFragment,
	SeriesPostsByPublicationDocument,
	SeriesPostsByPublicationQuery,
	SeriesPostsByPublicationQueryVariables,
} from '../../generated/graphql';
import { DEFAULT_COVER } from '../../utils/const';

type Props = {
	series: SeriesFragment;
	posts: PostFragment[];
	publication: PublicationFragment;
};

export default function Post({ series, publication, posts }: Props) {
	const title = `${series.name} - ${publication.title}`;

	return (
		<AppProvider publication={publication} series={series}>
			<Layout>
				<Head>
					<title>{title}</title>
				</Head>
				<Header />
				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					{series.coverImage ? (
						<div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
							<CoverImage
								title={series.name}
								src={resizeImage(
									series.coverImage,
									{
										w: 1200,
										h: 600,
										c: 'thumb',
									},
									DEFAULT_COVER,
								)}
								className="w-full h-full object-cover"
							/>
							{/* Overlay with text */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
								<div className="p-8 lg:p-12 text-white">
									<h1 className="text-4xl lg:text-6xl font-bold mb-4">
										{series.name}
									</h1>
									<div
										className="hashnode-content-style text-lg lg:text-xl leading-relaxed text-white/90 max-w-3xl"
										dangerouslySetInnerHTML={{ __html: series.description?.html ?? '' }}
									></div>
								</div>
							</div>
						</div>
					) : (
						<div className="pt-10">
							<div className="mb-8">
								<h1 className="text-5xl font-bold text-slate-900 dark:text-neutral-50 mb-6">
									{series.name}
								</h1>
								<div
									className="hashnode-content-style text-lg leading-relaxed text-slate-700 dark:text-neutral-300"
									dangerouslySetInnerHTML={{ __html: series.description?.html ?? '' }}
								></div>
							</div>
						</div>
					)}
					{posts.length > 0 ? (
						<MorePosts context="series" posts={posts} />
					) : (
						<div>No Posts found</div>
					)}
				</Container>
				<Footer />
			</Layout>
		</AppProvider>
	);
}

type Params = {
	slug: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
	if (!params) {
		throw new Error('No params');
	}
	const data = await request<SeriesPostsByPublicationQuery, SeriesPostsByPublicationQueryVariables>(
		process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
		SeriesPostsByPublicationDocument,
		{
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
			first: 20,
			seriesSlug: params.slug,
		},
	);

	const publication = data.publication;
	const series = publication?.series;
	if (!publication || !series) {
		return {
			notFound: true,
		};
	}
	const posts = publication.series ? publication.series.posts.edges.map((edge) => edge.node) : [];

	return {
		props: {
			series,
			posts,
			publication,
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};
