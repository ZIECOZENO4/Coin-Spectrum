import React from 'react'

const GetInTouch = () => {
  return (
    <div>
        <div className="relative flex items-top justify-start md:justify-center bg-black sm:items-center sm:pt-0">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
            <div className="mt-8 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-4 mr-2  sm:rounded-lg">
                        <h1 className="text-4xl sm:text-5xl text-yellow-500 font-extrabold tracking-tight">
                        Contact Us  
                        </h1>
                    

                        <div className="flex items-center mt-8 text-gray-600 dark:text-gray-400">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <div className="ml-4 text-md tracking-wide font-semibold w-40">
                            14331 SW 120TH ST MIAMI, FL 33186
                            </div>
                        </div>

                   

                        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <div className="ml-4 text-md tracking-wide font-semibold w-40">
                            Support@coinspectrum.net
                            </div>
                        </div>
                    </div>

                    <form className="p-4 flex flex-col justify-center">
                    <h1 className="text-4xl sm:text-5xl text-yellow-500 font-extrabold tracking-tight">
                                Get in touch
                        </h1>
                        <p className="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2">
                            Fill in the form to start a conversation
                        </p>
                        <div className="flex flex-col">
                            <label className="hidden">Full Name</label>
                            <input type="name" name="name" id="name" placeholder="Full Name" className="w-100 mt-2 py-3 px-3 rounded-lg bg-black border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-yellow-500 focus:outline-none" />
                        </div>

                        <div className="flex flex-col mt-2">
                            <label  className="hidden">Email</label>
                            <input type="email" name="email" id="email" placeholder="Email" className="w-100 mt-2 py-3 px-3 rounded-lg bg-black border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-yellow-500 focus:outline-none" />
                        </div>

                        <div className="flex flex-col mt-2">
                            <label  className="hidden">Number</label>
                            <input type="tel" name="tel" id="tel" placeholder="Telephone Number" className="w-100 mt-2 py-3 px-3 rounded-lg bg-black border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-yellow-500 focus:outline-none" />
                        </div>

                        <button type="submit" className="md:w-32 bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg mt-3 hover:bg-yellow-500 transition ease-in-out duration-300">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default GetInTouch