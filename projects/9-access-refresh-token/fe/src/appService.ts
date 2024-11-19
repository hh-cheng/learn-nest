import axios from 'axios'

import { useEffect, useState } from 'react'

axios.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token')
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
})

async function refreshToken() {
  const res = await axios.get('http://localhost:3000/user/refresh', {
    params: { refresh_token: localStorage.getItem('refresh_token') },
  })

  localStorage.setItem('access_token', res.data.access_token)
  localStorage.setItem('refresh_token', res.data.refresh_token)
  return res
}

axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { data, config } = err.response

    if (data.statusCode === 500 && !config.url.includes('refresh')) {
      const res = await refreshToken()

      if (res.status === 200) {
        return axios(config)
      } else {
        alert('login expired')
        return Promise.reject(res.data)
      }
    } else {
      return err.response
    }
  },
)

export default function useAppService() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const login = async () => {
    const res = await axios.post(
      'http://localhost:3000/user/login',
      {
        username: 'hh',
        password: '123123',
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    localStorage.setItem('access_token', res.data.access_token)
    localStorage.setItem('refresh_token', res.data.refresh_token)
  }

  const query = async () => {
    if (!localStorage.getItem('access_token')) {
      await login()
    }

    const indexData = await axios.get('http://localhost:3000')
    const loginData = await axios.get('http://localhost:3000/login-test')

    setA(indexData.data)
    setB(loginData.data)
  }

  useEffect(() => {
    query()
  }, [])

  return { a, b }
}
