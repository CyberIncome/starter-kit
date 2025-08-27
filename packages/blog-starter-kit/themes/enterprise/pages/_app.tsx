import { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/index.css';
import { AppProvider } from '../components/contexts/appContext';
import { CookieConsentWrapper } from '../components/cookie-consent-wrapper';

export default function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		(window as any).adjustIframeSize = (id: string, newHeight: string) => {
			const i = document.getElementById(id);
			if (!i) return;
			// eslint-disable-next-line radix
			i.style.height = `${parseInt(newHeight)}px`;
		};
	}, []);
	return (
		<AppProvider
			publication={pageProps.publication}
			post={pageProps.post}
			page={pageProps.page}
			series={pageProps.series}
		>
			<CookieConsentWrapper>
				<Component {...pageProps} />
			</CookieConsentWrapper>
		</AppProvider>
	);
}
