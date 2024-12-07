'use client'
import axios from 'axios'
import { useSession, signIn } from 'next-auth/react'
import { useEffect } from 'react'

const BASE_URL = 'http://localhost:3000'

const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

function useRefreshToken() {
  const { data: session } = useSession()

  return async () => {
    if (session) {
      const res = await axiosAuth(
        `/user/refresh?refresh_token=${session.refreshToken}`,
      )
      session.accessToken = res.data.accessToken
      session.refreshToken = res.data.refreshToken
    } else {
      signIn()
    }
  }
}

export default function useAxiosAuth() {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${session?.accessToken}`
        }
        return config
      },
      (err) => Promise.reject(err),
    )

    const responseIntercept = axiosAuth.interceptors.response.use(
      (res) => res,
      async (err) => {
        const prevRequest = err.config
        if (err.response?.code === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          await refreshToken()
          prevRequest.headers.Authorization = `Bearer ${session?.accessToken}`
          return axiosAuth(prevRequest)
        }
        return Promise.reject(err)
      },
    )

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept)
      axiosAuth.interceptors.response.eject(responseIntercept)
    }
  }, [session])

  return axiosAuth
}
