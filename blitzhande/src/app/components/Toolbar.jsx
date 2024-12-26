'use client'
import { useState } from 'react'
import styles from '../styles/Toolbar.module.css'
import ToggleButtonGroup from '../components/ToggleButtonGroup'

export default function Toolbar({mode, setMode, timeMode, setTimeMode, wordMode, setWordMode }) {
    const modes = [
        { value: 'time', label: 'time' },
        { value: 'words', label: 'words' }
    ];

    const timeModes = [
        { value: '15', label: '15' },
        { value: '30', label: '30' },
        { value: '60', label: '60' },
        { value: '120', label: '120' }
    ];

    const wordModes = [
        { value: '10', label: '10' },
        { value: '25', label: '25' },
        { value: '50', label: '50' },
        { value: '100', label: '100' }
    ];


    const handleMode = (value) => {
        setMode(value);
    }

    const handleTimeMode = (value) => {
        setTimeMode(value);
    }

    const handleWordMode = (value) => {
        setWordMode(value);
    }

    return (
        <div className={styles.toolbarContainer }>
            <ToggleButtonGroup options={modes}
                selectedValue={mode}
                onClick={handleMode }
            />
            <div className={styles.divider }/>
            <div>
                {mode === 'time' && 
                    <ToggleButtonGroup options={timeModes}
                    selectedValue={timeMode}
                    onClick={handleTimeMode} /> 
                }
                {mode === 'words' &&
                    <ToggleButtonGroup options={wordModes}
                        selectedValue={wordMode}
                        onClick={handleWordMode} />}
            </div>
        </div>
    );
}