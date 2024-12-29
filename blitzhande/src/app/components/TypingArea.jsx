'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
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
    const [lineNum, setLineNum] = useState(3);

    useEffect(() => {
        fetch(wordListPath)
            .then(response => response.text())
            .then(text => {
                const words = text.split(/\r?\n/);
                setWordList(words);
            })
            .catch(error => console.error('Error fetching word list:', error));
    }, [wordListPath, wordNum]);

    useEffect(() => {
        if (mode === 'time' && timeRemaining > 0) {
            const updateDimensions = () => {
                setWordContainerWidth(wordContainerRef.current.getBoundingClientRect().width);
                setWordWidth(wordRef.current.getBoundingClientRect().width);
                setCharOnLineLim(Math.floor(wordContainerWidth / wordWidth));
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    });

    useEffect(() => {
        initTest();
    }, [mode, timeMode, wordMode, wordContainerWidth, wordWidth, wordList]);

    const initTest = () => {
        setRawCharNum(0);
        setInput('');
        setLineStartIndex(0);
        setLineEndIndex(-1);
        setGeneratedWords([]);
        setTimeLimit(timeMode);
        setTimeRemaining(timeMode);
        setCorrectWordIndex(new Set());
        setIncorrectWordIndex(new Set());
        setCurIndex(0);
        setCharOnLineNum(0);
        setCharNum(0);
        setTimerOn(false);

        if (mode === 'time') {
            setTimeLimit(timeMode);
            let generated = [];
            for (let i = 0; i < lineNum; i++) {
                generated = generated.concat(randomWordsByLine());
            }
            setGeneratedWords(generated);
            console.log(generated);
        } else {
            let generated = [];
            for (let i = 0; i < wordMode; i++) {
                generated.push(randomWord());
            }
            setGeneratedWords(generated);
            console.log(generated);
        }
    }

    function randomWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }

    const randomWordsByLine = () => {
        let curChar = 0;
        const generated = [];
        let nextWord = randomWord();

        while(nextWord && curChar + 1 + nextWord.length < charOnLineLim) {
            generated.push(nextWord);
            curChar += nextWord.length + 1;
            nextWord = randomWord();
        }

        return generated;
    }

    const handleInputChangeTimeMode = (event) => {
        if (!timerOn) {
            setTimerOn(true);
        }

        const curWord = event.target.value;
        const lastChar = curWord[curWord.length - 1];
        const curWordTrimmed = curWord.trim();

        if (curWord.length < input.length) {
            if (curWord.length === 0) {
                setInput(' ');
                return;
            }
            setCharNum(prev => prev - 1);
            setRawCharNum(prev => prev - 1);
            setInput(curWord);
            return;
        } else {
            setCharNum(prev => prev + 1);
            setRawCharNum(prev => prev + 1);
        }

        if (lastChar === ' ') {
            const curCharOnLineNum = charOnLineNum + generatedWords[curIndex].length + 1;

            if (curIndex + 1 < generatedWords.length && curCharOnLineNum + generatedWords[curIndex + 1].length > charOnLineLim) {
                setLineStartIndex(lineEndIndex);
                setLineEndIndex(curIndex + 1);
                setCharOnLineNum(0);
                let generated = randomWordsByLine();
                setGeneratedWords(generatedWords.concat(generated));
            } else {
                setCharOnLineNum(curCharOnLineNum);
            }

            if (curWordTrimmed === generatedWords[curIndex]) {
                setCorrectWordIndex(prevItems => new Set(prevItems).add(curIndex));
            } else {
                setIncorrectWordIndex(prevItems => new Set(prevItems).add(curIndex));
            }

            setCurIndex(prev => prev + 1);
            setInput(' ');
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
                            onChange={handleInputChangeTimeMode}
                            autoFocus
                            value={input}
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