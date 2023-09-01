import React from 'react'

import Slider from '@mui/material/Slider'
import { FaRegSmile, FaRegSadTear } from 'react-icons/fa'

export default function QuestionComponent({
  question,
  setQuestion,
  happy,
  sad,
}) {
  return (
    <div className="w-full flex gap-5">
      <div className=" flex-1 p-3">
        <p className="text-sm font-semibold">{question}</p>
      </div>
      <div className="flex-1 p-3">
        <Slider
          // value={questionOne}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={e => setQuestion(e.target.value)}
        />
      </div>
      <div className="w-24 p-3">
        <div className="relative w-full flex justify-center">
          <FaRegSmile
            className="text-blue-700 absolute"
            size={'2.5em'}
            opacity={happy}
          />
          <FaRegSadTear
            className="text-red-700 absolute"
            size={'2.5em'}
            opacity={sad}
          />
        </div>
      </div>
    </div>
  )
}
