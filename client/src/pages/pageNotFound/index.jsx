
import React from 'react'

const PageNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-6xl font-bold text-gray-800'>404</h1>
      <p className='text-xl text-gray-600 mt-4'>Page Not Found</p>
      <p className='text-gray-500 mt-2'>The page you are looking for does not exist.</p>
      <a href="/shop/home" className='mt-6 text-blue-500 hover:underline'>Go back to Home</a>
    </div>
  )
}

export default PageNotFound;