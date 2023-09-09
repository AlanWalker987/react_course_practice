import React from 'react'

export default function NextButton({ dispatch, answer, index, numOfQuestions }) {

    if (index < numOfQuestions - 1)
        return (
            <div>
                <button className='btn btn-ui' onClick={() => dispatch({ type: 'nextQuestion' })}>Next</button>
            </div>
        )

    if (index === numOfQuestions - 1)
        return (
            <div>
                <button className='btn btn-ui' onClick={() => dispatch({ type: 'finish' })}>Finish</button>
            </div>
        )
}
