import { Button } from '@/components/ui/button'

function App() {
  return (
    <>
      <h1 className="text-center text-3xl font-bold text-blue-600">
        Hello world!
      </h1>
      <div className="mt-4 flex justify-center">
        <Button type="submit" className="cursor-pointer">
          Click me!
        </Button>
      </div>
    </>
  )
}

export default App
