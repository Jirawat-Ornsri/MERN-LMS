import React from 'react'
import CourseList from '../components/CourseList'
import Corasual from '../components/Corasual'
import Recommend from '../components/Recommend'

const HomePage = () => {
  return (
    <div className='my-16'>
      <Corasual/>
      <Recommend/>
      <CourseList/>
    </div>
  )
}

export default HomePage