import axios from 'axios'
import { useEffect, useState } from 'react'

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axios.interceptors.response.use((response) => {
  const newToken = response.headers.token
  if (newToken) {
    localStorage.setItem('token', newToken)
  }
  return response
})

export default function App() {
  const [content, setContent] = useState('')

  async function login() {
    const res = await axios.post('http://localhost:3000/user/login', {
      username: 'hh',
      password: '123456',
    })
    return res.data
  }

  async function query() {
    const token = await login()
    const res = await axios.get('http://localhost:3000/b', {
      headers: { Authorization: `Bearer ${token}` },
    })
    setContent(res.data)
  }

  useEffect(() => {
    query()
  }, [])

  return <div style={{ fontSize: 100 }}>{content}</div>
}
