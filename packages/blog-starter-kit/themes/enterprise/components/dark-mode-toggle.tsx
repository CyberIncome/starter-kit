import { useEffect, useState } from 'react';
import { Button } from './button';
import { MoonSVG, SunSVG } from './icons';

export const DarkModeToggle = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Check if dark mode is enabled on mount
		const isDarkMode = document.documentElement.classList.contains('dark');
		setIsDark(isDarkMode);
		
		// Listen for changes to the theme
		const observer = new MutationObserver(() => {
			const isDarkMode = document.documentElement.classList.contains('dark');
			setIsDark(isDarkMode);
		});
		
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});
		
		return () => observer.disconnect();
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !isDark;
		setIsDark(newDarkMode);
		
		if (newDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	return (
		<Button
			type="outline"
			label=""
			icon={isDark ? <SunSVG className="h-5 w-5 stroke-current" /> : <MoonSVG className="h-5 w-5 stroke-current" />}
			className="rounded-xl border-transparent !px-3 !py-2 text-white hover:bg-slate-900 dark:hover:bg-neutral-800"
			onClick={toggleDarkMode}
		/>
	);
};
