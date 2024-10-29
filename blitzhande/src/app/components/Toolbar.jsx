import styles from '../styles/Toolbar.module.css';
export default function Toolbar() {
    return (
        <div className={styles.toolbarContainer}>
            <h3 className={styles.toolbarToggle }>
                punctuation
            </h3>
            <h3 className={styles.toolbarToggle}>
                numbers
            </h3>
            <h3 className={styles.toolbarToggle}>
                time
            </h3>
            <h3 className={styles.toolbarToggle}>
                words
            </h3>
        </div>
    );
}