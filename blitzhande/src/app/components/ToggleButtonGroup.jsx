import { useState } from 'react'
import styles from "../styles/ToggleButtonGroup.module.css"
import ToggleButton from '../components/ToggleButton'

export default function ToggleButtonGroup ({ options, selectedValue, onClick }) {
    return (
        <div className={styles.toggleButtonGroup}>
            {options.map((option) => (
                <ToggleButton
                    key={option.value}
                    value={option.value}
                    selectedValue={selectedValue}
                    onClick={onClick}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </div>
    );
}