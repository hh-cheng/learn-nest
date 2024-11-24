import useAppService from './appService'

export default function App() {
  const { a, b } = useAppService()

  return (
    <div>
      <p>{a}</p>
      <p>{b}</p>
    </div>
  )
}
