"use client"
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

const QuestionsSection = ({mockInterviewQuestion, activeQuestionIndex}) => {
  const textToSpeach = (text) => {
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    } else {
      alert("Sorry, your browser does not support text to speech")
    }
  }

  return mockInterviewQuestion && (
    <div className='p-5 border border-gray-700 rounded-lg my-10 bg-gray-900'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion.map((question, index) => (
          <h2 key={index} className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer border border-gray-600
            ${activeQuestionIndex == index
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-gray-700 text-gray-300'}`}>
            Question #{index+1}
          </h2>
        ))}
      </div>
      <h2 className='my-5 text-md md:text-lg text-gray-100'>
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>
      <Volume2 className='cursor-pointer text-gray-400 hover:text-indigo-400'
        onClick={() => textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
      <div className='border border-indigo-800 rounded-lg p-5 bg-indigo-950 mt-20'>
        <h2 className='flex gap-2 items-center text-indigo-300'>
          <Lightbulb/>
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-indigo-200 my-2'>
          Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It has 5 questions which you can answer and at last you will get the report on the basis of your answer. NOTE: We never record your video, webcam access you can disable at any time if you want.
        </h2>
      </div>
    </div>
  )
}

export default QuestionsSection