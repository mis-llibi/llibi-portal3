import React, { useState } from 'react'

import GuestLayout from '@/components/Layouts/GuestLayout'
import Head from 'next/head'
import Button from '@/components/Button'
import TextArea from '@/components/TextArea'
import Label from '@/components/Label'

export default function FeedBackIndex() {
  // https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6
  // const [rating, setRating] = useState(0)
  const [feedBackForm, setFeedBackForm] = useState({
    rating: 3,
    comments: '',
  })

  const handleSubmit = async () => {
    console.log(feedBackForm)
  }
  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="py-12">
        <div className="md:w-[40em] mx-auto w-full px-10 md:px-0">
          <div className="mb-5">
            <Label className="mb-1">Please rate our service</Label>
            {[...Array(5)].map((star, index) => {
              index += 1
              return (
                <button
                  type="button"
                  key={index}
                  className={`${
                    index <= feedBackForm.rating
                      ? 'text-yellow-700'
                      : 'text-gray-400'
                  } bg-transparent border-none outline-none cursor-pointer`}
                  onClick={() =>
                    setFeedBackForm({ ...feedBackForm, rating: index })
                  }>
                  <span className="star text-4xl">&#9733;</span>
                </button>
              )
            })}
          </div>
          <div className="mb-5">
            <Label className="mb-1">Additional Feedback</Label>
            <textarea
              className="w-full border text-sm rounded-lg focus:outline focus:outline-1 block p-2.5"
              rows={5}
              placeholder="If you have any additional feedback, please type in here."
              defaultValue={feedBackForm.comments}
              onChange={e =>
                setFeedBackForm({ ...feedBackForm, comments: e.target.value })
              }
            />
          </div>
          <div className="mb-5">
            <Button loading={false} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
