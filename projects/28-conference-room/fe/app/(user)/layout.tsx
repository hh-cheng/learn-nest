import User from './components/user'

export default function UserLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <main>
      <header className="flex justify-between border-b-2 h-14 items-center px-6">
        <h1 className="font-bold text-2xl">
          Conference Room Management System
        </h1>
        <User />
      </header>
      {children}
    </main>
  )
}
