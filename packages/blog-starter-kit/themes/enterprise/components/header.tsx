import { PublicationNavbarItem } from '../generated/graphql';
import { Button } from './button';
import { Container } from './container';
import { DarkModeToggle } from './dark-mode-toggle';
import { useAppContext } from './contexts/appContext';
import HamburgerSVG from './icons/svgs/HamburgerSVG';
import { PublicationLogo } from './publication-logo';
import PublicationSidebar from './sidebar';

function hasUrl(
	navbarItem: PublicationNavbarItem,
): navbarItem is PublicationNavbarItem & { url: string } {
	return !!navbarItem.url && navbarItem.url.length > 0;
}

export const Header = () => {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';
	const { publication } = useAppContext();
	const navbarItems = publication.preferences.navbarItems.filter(hasUrl);
	
	// Add static pages to navbar items
	const staticPages = (publication as any).staticPages?.edges?.map((edge: any) => ({
		url: `/${edge.node.slug}`,
		label: edge.node.title,
		type: 'static-page'
	})) || [];
	
	// Combine navbar items and static pages
	const allNavItems = [...navbarItems, ...staticPages];

	const toggleSidebar = () => {
		// Simple toggle without state - will be handled by CSS
		const sidebar = document.getElementById('mobile-sidebar');
		if (sidebar) {
			sidebar.classList.toggle('hidden');
		}
	};

	const navList = (
		<ul className="hidden lg:flex flex-row items-center gap-4 text-white">
			{allNavItems.map((item) => (
				<li key={item.url}>
					<a
						href={item.url}
						className="transition-200 block rounded-full px-3 py-2 transition-colors hover:bg-white hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
					>
						{item.label}
					</a>
				</li>
			))}
		</ul>
	);

	return (
		<header className="border-b bg-slate-950 py-6 lg:py-10 dark:border-neutral-800 dark:bg-neutral-900">
			<Container className="grid grid-cols-4 gap-5 px-5">
				<div className="col-span-2 flex flex-1 flex-row items-center gap-2 lg:col-span-1">
					<div className="lg:hidden">
						<Button
							type="outline"
							label=""
							icon={<HamburgerSVG className="h-5 w-5 stroke-current" />}
							className="rounded-xl border-transparent !px-3 !py-2 text-white hover:bg-slate-900 dark:hover:bg-neutral-800"
							onClick={toggleSidebar}
						/>
					</div>
					<div className="hidden lg:block">
						<PublicationLogo />
					</div>
				</div>
				<div className="col-span-2 flex flex-row items-center justify-end gap-3 lg:gap-5 text-slate-300 lg:col-span-3">
					{navList}
					<DarkModeToggle />
				</div>
			</Container>
			<div className="mt-4 flex flex-col items-center gap-4 lg:hidden">
				<PublicationLogo />
			</div>
			
			{/* Mobile Sidebar - Always rendered but hidden by default */}
			<div id="mobile-sidebar" className="hidden lg:hidden">
				<PublicationSidebar navbarItems={allNavItems} toggleSidebar={toggleSidebar} />
			</div>
		</header>
	);
};
