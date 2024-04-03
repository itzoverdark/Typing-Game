import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from "axios"

function App() {

  const [words, setWords] = useState([])
  const [correct_words, setCorrectWords] = useState([])
  const [false_words, setFalseWords] = useState([])

  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);

  let current_height = useRef(0);
  let current_word = useRef(0);
  let current_char = useRef(0);

  // fetch words
  useEffect(() => {
    const get_words_request = async () => {
      await axios({
        method: "get",
        url: 'https://random-word-api.herokuapp.com/word?number=100'
      })
        .then(response => setWords(response.data))
        .catch(error => console.error(error))
    }
    get_words_request()
  }, [])

  // get initial height of the first word
  useEffect(() => {
    if (words.length > 0) {
      let word = document.getElementsByClassName(`word0 word`)[0];
      const rect = word.getBoundingClientRect();
      current_height.current = Math.floor(rect.top)
      setCursorX(Math.floor(rect.left) + 2)
      setCursorY(Math.floor(rect.top) + 2)
    }
  }, [words])

  // handle keyboard inputs
  const handleClick = (key) => {

    let word = document.getElementsByClassName(`word${current_word.current} word`)[0];
    let word_characters_count = word?.children.length - 1;

    let char = word?.children[current_char.current]
    let charRect = char?.getBoundingClientRect();

    if (key == 'Alt' || key == 'Control' || key == 'Tab' || key == 'Shift' || key == 'Enter' || key == 'AltGraph') {
      return;
    }

    if (!word) {
      setWords([])
      return;
    }

    if (current_char.current <= word_characters_count) {
      if (key == word?.children[current_char.current].textContent) {
        setCursorX(Math.floor(charRect.right))
        setCursorY(Math.floor(charRect.top))
        const index = correct_words.findIndex(obj => current_word.current in obj);
        if (index != -1) {
          const updatedCorrectWords = [...correct_words]
          if (!updatedCorrectWords[index][current_word.current].includes(current_char.current)) {
            updatedCorrectWords[index][current_word.current].push(current_char.current)
            setCorrectWords(updatedCorrectWords)
          }
        } else {
          setCorrectWords(prevWords => [...prevWords, { [current_word.current]: [current_char.current] }])
        }
      }
      if (key != word?.children[current_char.current].textContent && key != ' ') {
        setCursorX(Math.floor(charRect.right))
        setCursorY(Math.floor(charRect.top))
        const index = false_words.findIndex(obj => current_word.current in obj);
        if (index != -1) {
          const updatedCorrectWords = [...false_words]
          if (!updatedCorrectWords[index][current_word.current].includes(current_char.current)) {
            updatedCorrectWords[index][current_word.current].push(current_char.current)
            setFalseWords(updatedCorrectWords)
          }
        } else {
          setFalseWords(prevWords => [...prevWords, { [current_word.current]: [current_char.current] }])
        }
      }
    }
    if (key == ' ') {
      current_char.current = 0

      let next_word = document.getElementsByClassName(`word${current_word.current + 1} word`)[0];
      if (!next_word) {
        setWords([])
        return;
      }
      const rect = next_word.getBoundingClientRect();
      setCursorY(Math.floor(rect.top) + 2)
      setCursorX(Math.floor(rect.left) + 2)

      if (current_height.current != Math.floor(rect.top)) {
      
          current_height.current = Math.floor(rect.top)
          const newArray = words.slice(current_word.current + 1)
          setWords(newArray)
          setCorrectWords([])
          setFalseWords([])
          current_word.current = 0
          return;
      } else {
          current_word.current++
      }
    }
  }

  useEffect(() => {
    if (false_words.length > 0) {
      current_char.current++
    }
  }, [false_words])

  useEffect(() => {
    if (correct_words.length > 0) {
      current_char.current++
    }
  }, [correct_words])

  return (
    <div>
      <div className='header'></div>
      <div tabIndex={0} onKeyDown={(e) => handleClick(e.key)} className='parent-container'>

        <div className={`cursor`} style={{ position: 'absolute', left: cursorX, top: cursorY }}></div>
        {words?.map((word, i) => (
          <div key={i} className={`word${i} word`}>
            {word.split('').map((char, j) => {
              const isCorrect = correct_words.some(obj => obj[i] && obj[i].includes(j));
              const isFalse = false_words.some(obj => obj[i] && obj[i].includes(j));
              return (
                <span className={`char${j} ${isFalse ? 'false' : ''}  ${isCorrect ? 'correct' : ''} `} key={j}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}

      </div >
      <div className='footer'></div>
    </div>
  )
}

export default App
