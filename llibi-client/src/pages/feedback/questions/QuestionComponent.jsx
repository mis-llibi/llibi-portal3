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

  const marks = [
    {
      value: 1,
      label: (
        <div className="flex flex-col items-center">
          <span>Very Difficult</span>
          <img
            src={'/happy-face/angry.png'}
            className="w-[128px] md:w-[36px]"
            alt="angry"
          />
        </div>
      ),
    },
    {
      value: 2,
      label: (
        <div className="flex flex-col items-center">
          <span>Difficult</span>
          <img
            src={'/happy-face/sad.png'}
            className="w-[128px] md:w-[36px]"
            alt="sad"
          />
        </div>
      ),
    },
    {
      value: 3,
      label: (
        <div className="flex flex-col items-center">
          <span>Moderate</span>
          <img
            src={'/happy-face/mad.png'}
            className="w-[128px] md:w-[36px]"
            alt="mad"
          />
        </div>
      ),
    },
    {
      value: 4,
      label: (
        <div className="flex flex-col items-center">
          <span>Easy</span>
          <img
            src={'/happy-face/smile.png'}
            className="w-[128px] md:w-[36px]"
            alt="smile"
          />
        </div>
      ),
    },
    {
      value: 5,
      label: (
        <div className="flex flex-col items-center">
          <span>Very Easy</span>
          <img
            src={'/happy-face/happy.png'}
            className="w-[128px] md:w-[36px]"
            alt="happy"
          />
        </div>
      ),
    },
  ]

  return (
    <div className="w-full flex flex-col md:flex-row gap-5 mb-10">
      <div className=" flex-1 py-3">
        <p className="text-sm">{question}</p>
      </div>
      <div className="flex-1 p-3 flex items-center">
        <Slider
          value={typeof questionValue === 'number' ? questionValue : 0}
          aria-label="Default"
          valueLabelDisplay="off"
          // onChange={e => setQuestion(e.target.value)}
          onChange={handleSliderChange}
          step={1}
          marks={marks}
          min={1}
          max={5}
        />
      </div>
    </div>
  )
}
