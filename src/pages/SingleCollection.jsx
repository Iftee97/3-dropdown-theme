import React from 'react'
import { useParams } from 'react-router-dom'

export default function SingleCollection() {
  const { handle } = useParams()
  console.log('handle: >>>>>>>>>>', handle)

  return (
    <div>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '2rem',
        }}
      >
        Collection: {handle}
      </h1>
    </div>
  )
}
