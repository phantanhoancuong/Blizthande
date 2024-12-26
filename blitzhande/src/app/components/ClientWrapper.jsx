'use client'
import styles from '../styles/ClientWrapper.module.css'
import { useState } from 'react'
import Header from './Header'
import Toolbar from './Toolbar'
import TypingArea from './TypingArea'

export default function ClientWrapper() {
    const [mode, setMode] = useState('time');
    const [timeMode, setTimeMode] = useState('15');
    const [wordMode, setWordMode] = useState('10');

    return (
        <div className={styles.homeContainer}>
            <div className={styles.headerSection}>
                <Header className={styles.homeHeader} />
                <Toolbar className={styles.homeToolbar}
                    mode={mode}
                    setMode={setMode}
                    timeMode={timeMode}
                    setTimeMode={setTimeMode}
                    wordMode={wordMode}
                    setWordMode={setWordMode}
                />
            </div>
            <div className={styles.contentSection}>
                <TypingArea className={styles.typingArea}
                    mode={mode}
                    timeMode={timeMode}
                    wordMode={wordMode}
                />
            </div>
        </div>
    )
}