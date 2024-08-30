import React from "react"
import {nanoid} from "nanoid"
import {decode} from "html-entities"


export default function Quiz(props) {
  
    let answers = props.q.answers

    function handleClick(answer) {
        if(props.q.checked) {
            return
        }
        props.handleClickAnswer(props.id, answer)
    }

    const answerElements = answers.map(answer => {
        let style = null        
        if(props.q.checked) {
            if(props.q.correct == answer) {
                style = "correct"
            }
            else if(props.q.selected === answer) {
                style = "incorrect"
            }
            else {
                style = "not-selected"
            }
        }
        return <span id={style} className={answer === props.q.selected ? 'answers selected' : 'answers'} key={nanoid()} onClick={() => handleClick(answer)}>{decode(answer)}</span>
    })
    return(
        <div className="quiz-page">
            <div className="question">
                {decode(props.q.question)}
            </div>
           {answerElements}
           <div className="line"></div>
        </div>
    )
}