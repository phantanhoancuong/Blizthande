import React from 'react'
import styles from '../styles/Word.module.css'

export default function Word({ text, state }) {
    let wordStyle = styles.defaultWord;

    switch (state) {
        case 'typing':
            wordStyle = styles.typingWord;
            break;
        case 'correct':
            wordStyle = styles.correctWord;
            break;
        case 'incorrect':
            wordStyle = styles.incorrectWord;
            break;
        case 'invisible':
            wordStyle = styles.invisible;
            break;
        default:
            break;
    }

    return <span className={wordStyle}>{text}</span>
};