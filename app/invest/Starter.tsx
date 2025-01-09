'use client'
import React, { useState } from 'react';

const Starter = () => {

  return (
<div className=' mb-8 mt-4 px-4'>
<section className="bg-black py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">Starter Plan</h3>
          <p className="mt-4 text-gray-400">Get started with our Starter Investment.</p>
        </div>
        <div className="mb-8">
          <span className="text-5xl font-extrabold text-white">4%</span>
          <span className="text-xl font-medium text-gray-400">/RIO</span>
        </div>
        <ul className="mb-8 space-y-4 text-gray-400">
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Total Roll:   4%</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Duration:   24 Hours</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Minium Deposit:  $100</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Maxium Deposit:  $1000</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant Withdrawal</span>
          </li>
        </ul>
        <a href="/dashboard/invest" className="block w-full py-3 px-6 text-center rounded-md text-white font-medium  bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600">
       Invest Now 
        </a>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">Magnet Plan</h3>
          <p className="mt-4 text-gray-400">Get started with our Magnet Investment.</p>
        </div>
        <div className="mb-8">
          <span className="text-5xl font-extrabold text-white">10%</span>
          <span className="text-xl font-medium text-gray-400">/RIO</span>
        </div>
        <ul className="mb-8 space-y-4 text-gray-400">
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Total Roll:   10%</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Duration:   48 Hours</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Minium Deposit:  $1100</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Maxium Deposit:  $5000</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant Withdrawal</span>
          </li>
        </ul>
        <a href="/dashboard/invest" className="block w-full py-3 px-6 text-center rounded-md text-white font-medium  bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600">
       Invest Now 
        </a>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">Expert Plan</h3>
          <p className="mt-4 text-gray-400">Get started with our Expert Investment.</p>
        </div>
        <div className="mb-8">
          <span className="text-5xl font-extrabold text-white">15%</span>
          <span className="text-xl font-medium text-gray-400">/RIO</span>
        </div>
        <ul className="mb-8 space-y-4 text-gray-400">
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Total Roll:   15%</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Duration:   72 Hours</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Minium Deposit:  $5100</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Maxium Deposit:  $10,000</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant Withdrawal</span>
          </li>
        </ul>
        <a href="/dashboard/invest" className="block w-full py-3 px-6 text-center rounded-md text-white font-medium  bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600">
       Invest Now 
        </a>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">Premium Plan</h3>
          <p className="mt-4 text-gray-400">Get started with our Premium Investment.</p>
        </div>
        <div className="mb-8">
          <span className="text-5xl font-extrabold text-white">25%</span>
          <span className="text-xl font-medium text-gray-400">/RIO</span>
        </div>
        <ul className="mb-8 space-y-4 text-gray-400">
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Total Roll:   25%</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Duration:   5 Days</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Minium Deposit:  $10,100</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Maxium Deposit:  $20,000</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant Withdrawal</span>
          </li>
        </ul>
        <a href="/dashboard/invest" className="block w-full py-3 px-6 text-center rounded-md text-white font-medium  bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600">
       Invest Now 
        </a>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">Gold Plan</h3>
          <p className="mt-4 text-gray-400">Get started with our Gold Investment.</p>
        </div>
        <div className="mb-8">
          <span className="text-5xl font-extrabold text-white">30%</span>
          <span className="text-xl font-medium text-gray-400">/RIO</span>
        </div>
        <ul className="mb-8 space-y-4 text-gray-400">
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Total Roll:   30%</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Duration:   6 Days</span>
          </li>
          <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Minium Deposit:  $20,100</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Maxium Deposit:  Unlimited</span>
          </li>
               <li className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant Withdrawal</span>
          </li>
        </ul>
        <a href="/dashboard/invest" className="block w-full py-3 px-6 text-center rounded-md text-white font-medium bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600">
       Invest Now 
        </a>
      </div>
    </div>
  </div>
</section>
</div>
  );
};

export default Starter;