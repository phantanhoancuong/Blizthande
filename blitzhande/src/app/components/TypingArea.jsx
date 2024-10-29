'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/TypingArea.module.css';


export default function TypingArea() {
    const [wordList, setWordList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [curIndex, setCurIndex] = useState(0);
    const [rightWordNum, setRightWordNum] = useState(0);
    const [incorrectWords, setIncorrectWords] = useState(new Set());
    const [correctWords, setCorrectWords] = useState(new Set());

    useEffect(() => {
        fetch('/words.txt')
            .then(response => response.text())
            .then(text => {
                const words = text.split('\n').map(word => word.trim()).filter(word => word);
                const wordNum = 50;
                const generatedWords = [];
                for (let i = 0; i < wordNum; i++) {
                    const randomIndex = Math.floor(Math.random() * words.length);
                    generatedWords.push(words[randomIndex]);
                };
                setWordList(generatedWords);
            });
    }, []);

    const handleInputChange = (event) => {
        const curWord = event.target.value;
        const lastChar = curWord[curWord.length - 1];

        if (lastChar === ' ') {
            if (curWord.trim().length > 0) {
                const currentWord = curWord.trim();
                if (currentWord === wordList[curIndex]) {
                    setRightWordNum(rightWordNum + 1);
                    setCorrectWords(prev => new Set(prev).add(curIndex));
                } else {
                    setIncorrectWords(prev => new Set(prev).add(curIndex));
                }
                setCurIndex(curIndex + 1);
                setInputValue('');
            }
        } else {
            setInputValue(curWord);
        }
    }

    return (
        <div className={styles.typingAreaContainer}>
            <h2 className={styles.typingAreaWords} tabIndex="-1">
                {wordList.map((word, index) => {
                    let wordStyle = styles.defaultWord;
                    if (index === curIndex) {
                        wordStyle = styles.currentWord;
                    } else if (correctWords.has(index)) {
                        wordStyle = styles.correctWord;
                    } else if (incorrectWords.has(index)) {
                        wordStyle = styles.incorrectWord;
                    }
                    return (
                        <span key={index} className={wordStyle}>
                            {word}{' '}
                        </span>
                    );
                })}
            </h2>
            <div className={styles.typingInputRow}>
                <input
                    type="text"
                    className={styles.typingAreaInput}
                    onChange={handleInputChange}
                    value={inputValue}
                    autoFocus
                />
                <h1>Timer</h1>
            </div>
            <h1>Correct words: {rightWordNum} / 50</h1>
        </div>
    );
}