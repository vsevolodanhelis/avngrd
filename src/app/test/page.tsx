export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
        <p className="text-gray-600">If you can see this styled, Tailwind is working!</p>
        <div className="mt-4 w-16 h-16 bg-yellow-400 rounded-full"></div>
      </div>
    </div>
  )
}
