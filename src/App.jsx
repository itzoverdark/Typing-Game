import { useState, useEffect, useRef } from 'react'
import './App.css'
import axios from "axios"

function App() {

  const [words, setWords] = useState([])
  const [correct_words, setCorrectWords] = useState([])
  const [false_words, setFalseWords] = useState([])

  let isIncremented = useRef(false)

  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);

  let hideCursor = useRef(false);

  let current_height = useRef(0);
  let current_word = useRef(0);
  let current_char = useRef(0);

  const [cursorOpacity, setCursorOpacity] = useState(100)
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

    if (key == 'Backspace') {
      isIncremented.current = false

      if (current_word.current > 0) {
        if (current_char.current > 0) {
          
          const CorrectIndex = correct_words.findIndex(obj => current_word.current in obj);
          const FalseIndex = false_words.findIndex(obj => current_word.current in obj);

          
          if (FalseIndex != -1) {
            const updatedFalseWords = [...false_words]
            if (updatedFalseWords[FalseIndex][current_word.current].includes((current_char.current - 1))) {
              updatedFalseWords[FalseIndex][current_word.current].pop()
              setFalseWords(updatedFalseWords)
            }
          }
          if (CorrectIndex != -1) {
            const updatedCorrectWords = [...correct_words]
            if (updatedCorrectWords[CorrectIndex][current_word.current].includes((current_char.current - 1))) {
              updatedCorrectWords[CorrectIndex][current_word.current].pop()
              setCorrectWords(updatedCorrectWords)
            } else {
              setCorrectWords(updatedCorrectWords)
            }          
          }

          current_char.current--;

          let char = word?.children[current_char.current]
          let charRect = char?.getBoundingClientRect();

          setCursorX(Math.floor(charRect.left))
          setCursorY(Math.floor(charRect.top))

          return

        } else {
          current_word.current--;
          let word = document.getElementsByClassName(`word${current_word.current} word`)[0];
          current_char.current = word.children.length - 1;
          

          let char = word.children[current_char.current]
          let charRect = char.getBoundingClientRect();

          const CorrectIndex = correct_words.findIndex(obj => current_word.current in obj);
          const FalseIndex = false_words.findIndex(obj => current_word.current in obj);

          
          if (FalseIndex != -1) {
            const updatedFalseWords = [...false_words]
            if (updatedFalseWords[FalseIndex][current_word.current].includes((current_char.current - 1))) {
              updatedFalseWords[FalseIndex][current_word.current].pop()
              setFalseWords(updatedFalseWords)
            }
          }
          if (CorrectIndex != -1) {
            const updatedCorrectWords = [...correct_words]
            if (updatedCorrectWords[CorrectIndex][current_word.current].includes((current_char.current - 1))) {
              updatedCorrectWords[CorrectIndex][current_word.current].pop()
              setCorrectWords(updatedCorrectWords)
            } else {
              setCorrectWords(updatedCorrectWords)
            }          
          }

          setCursorX(Math.floor(charRect.left))
          setCursorY(Math.floor(charRect.top))

          return
        }
      } else {
        if (current_char.current > 0) {

          const CorrectIndex = correct_words.findIndex(obj => current_word.current in obj);
          const FalseIndex = false_words.findIndex(obj => current_word.current in obj);
          
          if (FalseIndex != -1) {
            const updatedFalseWords = [...false_words]
            if (updatedFalseWords[FalseIndex][current_word.current].includes((current_char.current - 1))) {
              updatedFalseWords[FalseIndex][current_word.current].pop()
              setFalseWords(updatedFalseWords)
            }
          }
          if (CorrectIndex != -1) {
            const updatedCorrectWords = [...correct_words]
            if (updatedCorrectWords[CorrectIndex][current_word.current].includes((current_char.current - 1))) {
              updatedCorrectWords[CorrectIndex][current_word.current].pop()
              setCorrectWords(updatedCorrectWords)
            } else {
              setCorrectWords(updatedCorrectWords)
            }          
          }

          current_char.current--;

          let char = word?.children[current_char.current]
          let charRect = char?.getBoundingClientRect();

          setCursorX(Math.floor(charRect.left))
          setCursorY(Math.floor(charRect.top))

          return
        } else {
          current_char.current = 0;
          setCorrectWords([])
          setFalseWords([])

          return
        }
      }
    }

    if (current_char.current <= word_characters_count) {
      if (key == word?.children[current_char.current].textContent && key != '') {
        isIncremented.current = true
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
        isIncremented.current = true
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
      isIncremented.current = true
      current_char.current = 0

      let next_word = document.getElementsByClassName(`word${current_word.current + 1} word`)[0];
      if (!next_word) {
        setWords([])
        hideCursor.current = true;
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
    if (false_words.length > 0 && isIncremented.current) {
      current_char.current++
    }
  }, [false_words])

  useEffect(() => {
    if (correct_words.length > 0 && isIncremented.current) {
      current_char.current++
    }
  }, [correct_words])

  useEffect(() => {
    const interval = setInterval(() => {
      if (cursorX === 230 || cursorX == 231 || cursorX == 229) {
        setCursorOpacity(prevOpacity => (prevOpacity === 100 ? 0 : 100));
      }
    }, 1000);
    setCursorOpacity(100);

    return () => clearInterval(interval);
  }, [cursorX]);
  return (
    <div>
      <div className='header'></div>
      <div tabIndex={0} onKeyDown={(e) => handleClick(e.key)} className='parent-container'>

        <div className={`cursor`} style={{ position: 'absolute', left: cursorX,opacity: cursorOpacity , top: cursorY, display:`${hideCursor.current ? 'none' : 'block'}` }}></div>
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
