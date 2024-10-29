import styles from '../styles/Header.module.css';
import Link from 'next/link';
export default function Header() {
	return (
		<div className={styles.headerContainer}>
			<div className={styles.headerSection}>
				<Link href="/" className={styles.logo}>
					<p className={styles.logoSubtext}>
						Blitzing through
					</p>
					<h1 className={styles.logoText}>
						Blitzhande
					</h1>
				</Link>
			</div>
			<div className={styles.headerSection}>
				<h1 className={styles.headerNavicon}>
					about
				</h1>
				<h1 className={styles.headerNavicon}>
					settings
				</h1>
			</div>
		</div>
	);
}