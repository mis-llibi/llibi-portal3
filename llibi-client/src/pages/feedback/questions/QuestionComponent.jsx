import React from 'react'

import Slider from '@mui/material/Slider'
import { FaRegSmile, FaRegSadTear } from 'react-icons/fa'

export default function QuestionComponent({
  questionValue,
  question,
  setQuestion,
}) {
  const handleSliderChange = (event, newValue) => {
    setQuestion(newValue)
  }

  return (
    <div className="w-full flex gap-5">
      <div className=" flex-1 p-3">
        <p className="text-sm font-semibold">{question}</p>
      </div>
      <div className="flex-1 p-3">
        <Slider
          value={typeof questionValue === 'number' ? questionValue : 0}
          aria-label="Default"
          valueLabelDisplay="auto"
          // onChange={e => setQuestion(e.target.value)}
          onChange={handleSliderChange}
          step={10}
          marks
          min={0}
          max={100}
        />
      </div>
      <div className="w-24 p-3">
        <div className="relative w-full flex justify-center">
          {questionValue >= 0 && questionValue <= 20 && (
            <img src={'/happy-face/angry.png'} width={36} alt="angry" />
          )}
          {questionValue >= 21 && questionValue <= 49 && (
            <img src={'/happy-face/sad.png'} width={36} alt="sad" />
          )}
          {questionValue === 50 && (
            <img src={'/happy-face/mad.png'} width={36} alt="mad" />
          )}
          {questionValue >= 51 && questionValue <= 70 && (
            <img src={'/happy-face/smile.png'} width={36} alt="smile" />
          )}
          {questionValue >= 71 && questionValue <= 100 && (
            <img src={'/happy-face/happy.png'} width={36} alt="happy" />
          )}
        </div>
      </div>
    </div>
  )
}
