import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/Header";
import Toolbar from './components/Toolbar';
import TypingArea from './components/TypingArea';

export default function Home() {
    return (
        <div className={styles.homeContainer}>
            <div className={styles.headerSection}>
                <Header className={styles.homeHeader} />
                <Toolbar className={styles.homeToolbar} />
            </div>
            <div className={styles.contentSection}>
                <TypingArea className={styles.typingArea} />
            </div>
        </div>
  );
}
