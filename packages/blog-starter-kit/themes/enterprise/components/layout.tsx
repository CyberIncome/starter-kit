import { Analytics } from './analytics';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';

type Props = {
	children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
	return (
		<>
			<Meta />
			<Scripts />
			<script
				dangerouslySetInnerHTML={{
					__html: `
						(function() {
							try {
								var theme = localStorage.getItem('theme');
								if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
									document.documentElement.classList.add('dark');
								} else {
									document.documentElement.classList.remove('dark');
								}
							} catch (e) {}
						})();
					`,
				}}
			/>
			<div className="min-h-screen bg-white dark:bg-black">
				<main>{children}</main>
			</div>
			<Analytics />
			<Integrations />
		</>
	);
};
