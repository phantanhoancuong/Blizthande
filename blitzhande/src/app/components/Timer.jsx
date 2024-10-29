import { useEffect, useState } from 'react';
import styles from '../styles/Timer.module.css'

export default function Timer() {
    const [timeRemaining, setTimeRemaining] = useState(60);
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    return (
        <div className={styles.timerContainer }>
            {timeRemaining > 0 ? (
                <span>{timeRemaining}</span>
            ) : (
                <h1>{"Time's up!"}</h1>
            )}
        </div>
    );
};