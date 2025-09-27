import Header from '@/components/Header'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='min-h-screen text-gray-400'>
        <Header/>
        <div>
            {children}
        </div>
    </main>
  )
}

export default layout