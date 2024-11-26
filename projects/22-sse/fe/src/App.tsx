import { useEffect } from 'react'

export default function App() {
  // useEffect(() => {
  //   const eventSource = new EventSource('http://localhost:3000/stream')
  //   eventSource.onmessage = ({ data }) => {
  //     console.log('new message', JSON.parse(data))
  //   }
  // }, [])

  // useEffect(() => {
  //   const eventSource = new EventSource('http://localhost:3000/stream2')
  //   eventSource.onmessage = ({ data }) => {
  //     console.log('new message', JSON.parse(data))
  //   }
  // }, [])

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/stream3')
    eventSource.onmessage = ({ data }) => {
      console.log('new message', JSON.parse(data))
    }
  }, [])

  return <div>app</div>
}
