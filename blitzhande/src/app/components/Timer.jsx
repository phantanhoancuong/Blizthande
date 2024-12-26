'use client'
import { useEffect, useState } from 'react';
import styles from '../styles/Timer.module.css'

export default function Timer({ setTimeRemaining, timeRemaining, timerOn, setTimerOn, timeLimit}) {
    useEffect(() => {
        if (timerOn && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [setTimeRemaining, timeRemaining, timerOn]);

    useEffect(() => {
        setTimerOn(false);
        setTimeRemaining(timeLimit);
    },[timeLimit, setTimeRemaining, setTimerOn])

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