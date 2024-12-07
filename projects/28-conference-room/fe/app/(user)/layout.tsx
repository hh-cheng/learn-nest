export default function UserLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <main>
      <h1 className="border-b-2 h-14 flex items-center px-6 text-2xl">
        Conference Room Management
      </h1>
      {children}
    </main>
  )
}
