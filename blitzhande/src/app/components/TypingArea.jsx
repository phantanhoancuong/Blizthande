'use client';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/TypingArea.module.css';
import Word from '../components/Word';
import Timer from '../components/Timer';

export default function TypingArea({ mode, timeMode, wordMode }) {
    const [generatedWords, setGeneratedWords] = useState([]);
    const [input, setInput] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [correctWordNum, setCorrectWordNum] = useState(0);
    const [correctWordIndex, setCorrectWordIndex] = useState(new Set());
    const [incorrectWordIndex, setIncorrectWordIndex] = useState(new Set());
    const [timeLimit, setTimeLimit] = useState(10);
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);
    const [wordListPath, setWordListPath] = useState('/words.txt');
    const [wordList, setWordList] = useState(new Set());
    const [charOnLineNum, setCharOnLineNum] = useState(0);
    const [charOnLineLim, setCharOnLineLim] = useState(0);
    const [rawCharNum, setRawCharNum] = useState(0);
    const [correctCharNum, setCorrectCharNum] = useState(0);
    const [incorrectCharNum, setIncorrectCharNum] = useState(0);
    const [charNum, setCharNum] = useState(0);
    const [lineStartIndex, setLineStartIndex] = useState(0);
    const [lineEndIndex, setLineEndIndex] = useState(-1);
    const [curIndex, setCurIndex] = useState(0);
    const [wordNum, setWordNum] = useState(100);
    const wordContainerRef = useRef(null);
    const wordRef = useRef(null);
    const [timerOn, setTimerOn] = useState(false);
    const [wordContainerWidth, setWordContainerWidth] = useState(0);
    const [wordWidth, setWordWidth] = useState(0);

    useEffect(() => {
        if (mode !== 'time') return;
        setTimeLimit(timeMode);
        setRawCharNum(0);
        setInput('');
        setLineStartIndex(0);
        setLineEndIndex(-1);
        setGeneratedWords(randomWordsByNum(wordList, wordNum));
    }, [timeMode, mode, wordList, wordNum]);

    useEffect(() => {
        setWordContainerWidth(wordContainerRef.current.getBoundingClientRect().width);
    }, []);

    useEffect(() => {
        const updateWordContainerWidth = () => {
            setWordContainerWidth(wordContainerRef.current.getBoundingClientRect().width);
        };
        window.addEventListener('resize', updateWordContainerWidth);
        return () => window.removeEventListener('resize', updateWordContainerWidth);
    }, []);

    useEffect(() => {
        const updateWordWidth = () => {
            setWordWidth(wordRef.current.getBoundingClientRect().width);
        };
        window.addEventListener('resize', updateWordWidth);
        updateWordWidth();
        return () => window.removeEventListener('resize', updateWordWidth);
    }, []);

    useEffect(() => {
        setCharOnLineLim(Math.floor(wordContainerWidth / wordWidth));
    }, [wordContainerWidth, wordWidth]);

    useEffect(() => {
        fetch(wordListPath)
            .then(response => response.text())
            .then(text => {
                const words = text.split(/\r?\n/);
                setWordList(words);
                setGeneratedWords(randomWordsByNum(words, wordNum));
            })
            .catch(error => console.error('Error fetching word list:', error));
    }, [wordListPath, wordNum]);

    const randomWordsByNum = (words, count) => {
        const selectedWords = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            selectedWords.push(words[randomIndex]);
        }
        return selectedWords;
    };

    const handleInputChange = (event) => {
        if (!timerOn) setTimerOn(true);

        const curWord = event.target.value;
        const lastChar = curWord[curWord.length - 1];
        const curWordTrimmed = curWord.trim();

        if (curWordTrimmed.length < input.length) {
            setCharNum(prev => prev - 1);
            setRawCharNum(prev => prev + 1);
        } else if (curWordTrimmed.length > 0) {
            setCharNum(prev => prev + 1);
            setRawCharNum(prev => prev + 1);
        } else {
            return;
        }

        if (lastChar === ' ') {
            const curCharOnLineNum = charOnLineNum + generatedWords[curIndex].length + 1;

            // Mark the words' indices of the last typed line
            if (curIndex + 1 < generatedWords.length && curCharOnLineNum + generatedWords[curIndex + 1].length > charOnLineLim) {
                setLineStartIndex(lineEndIndex + 1);
                setLineEndIndex(curIndex + 1);
                setCharOnLineNum(0);
            } else {
                setCharOnLineNum(curCharOnLineNum);
            }

            if (curWordTrimmed === generatedWords[curIndex]) {
                setCorrectWordIndex(prevItems => new Set(prevItems).add(curIndex));
            } else {
                setIncorrectWordIndex(prevItems => new Set(prevItems).add(curIndex));
            }

            setCurIndex(prev => prev + 1);
            setInput('');
        } else {
            setInput(curWord);
        }
    };

    return (
        <div>
            <h2 ref={wordRef} className={styles.typingAreaText} style={{ visibility: 'hidden', position: 'absolute' }}>A</h2>
            {timeRemaining > 0 ? (
                <div className={styles.typingAreaContainer}>
                    <div ref={wordContainerRef} className={styles.typingAreaTextBox}>
                        <h2 className={styles.typingAreaText}>
                            {lineEndIndex < 0 ? (
                                <span style={{ visibility: 'hidden' }}>A</span>
                            ) : (
                                generatedWords.map((word, index) => {
                                    let wordStyle = styles.defaultWord;
                                    if (index < lineStartIndex || index >= lineEndIndex) return null;
                                    if (correctWordIndex.has(index)) wordStyle = styles.correctWord;
                                    if (incorrectWordIndex.has(index)) wordStyle = styles.incorrectWord;
                                    return <span key={index} className={wordStyle}>{word}{' '}</span>;
                                })
                            )}
                        </h2>
                        <h2 className={styles.typingAreaText}>
                            {generatedWords.map((word, index) => {
                                let wordStyle = styles.defaultWord;
                                if (index < lineEndIndex) return null;
                                if (index === curIndex) wordStyle = styles.currentWord;
                                if (correctWordIndex.has(index)) wordStyle = styles.correctWord;
                                if (incorrectWordIndex.has(index)) wordStyle = styles.incorrectWord;
                                return <span key={index} className={wordStyle}>{word}{' '}</span>;
                            })}
                        </h2>
                    </div>
                    <div className={styles.inputRow}>
                        <input
                            type="text"
                            className={styles.input}
                            onChange={handleInputChange}
                            value={input}
                            autoFocus
                        />
                        <Timer
                            setTimeRemaining={setTimeRemaining}
                            timeRemaining={timeRemaining}
                            timerOn={timerOn}
                            setTimerOn={setTimerOn}
                            timeLimit={timeLimit}
                        />
                    </div>
                    <div>
                        <h2>Line Start Index: {lineStartIndex}</h2>
                        <h2>Char Limit Per Line: {charOnLineLim}</h2>
                        <h2>Char On Line Num: {charOnLineNum}</h2>
                        <h2>Char Num: {charNum}</h2>
                        <h2>Raw Char Num: {rawCharNum}</h2>
                    </div>
                </div>
            ) : (
                <div className={styles.typingAreaContainer}>
                    <h2>Gross WPM: {Math.floor((rawCharNum / 5.0) * (60.0 / timeLimit))}</h2>
                </div>
            )}
        </div>
    );
}