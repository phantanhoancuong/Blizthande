import { useEffect, useState } from 'react';
import styles from '../styles/Timer.module.css'

export default function Timer({ setTimeRemaining, timeRemaining }) {
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [setTimeRemaining, timeRemaining]);

    return (
        <div className={styles.timerContainer}>
            {timeRemaining > 0 ? (
                <p>{timeRemaining}</p>
            ): (
                <p>{"Time's up!"}</p>
            )}
        </div>
    );
};