import styles from '../styles/ToggleButton.module.css'

export default function ToggleButton({ value, selectedValue, onClick, children }) {
    const isSelected = selectedValue === value;
    return (
        <button          
            onClick={() => onClick(value)}
            className={isSelected ? styles.selectedToggleButton : styles.toggleButton}
        >
            {children}
        </button>
    );
};