'use client'

export default function HeroSection() {
  return (
    <div className="bg-gray-950 min-h-screen flex items-center">
      <div className="relative isolate px-6 pt-14 lg:px-8 w-full">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-20">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-gray-700 hover:ring-gray-500">
              How to use IntervX.{' '}
              <a href="/how-it-works" className="font-semibold text-indigo-400">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              A Structured Path to Interview Success
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400 sm:text-xl">
              Double your chances of landing that job offer with our AI-powered interview prep
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/dashboard" className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Get started
              </a>
              <a href="/dashboard" className="text-sm font-semibold leading-6 text-gray-400 hover:text-indigo-400">
                Learn more &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}