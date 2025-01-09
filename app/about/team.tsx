"use client";
import React from 'react';
import { MailOpenIcon } from '@/components/icons/Icons';

const dummyAgents = [
  {
    _id: "1",
    name: "John Doe",
    image: { asset: { _ref: "image-1" } },
    role: "CEO",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe"
  },
  {
    _id: "2",
    name: "Jane Smith",
    image: { asset: { _ref: "image-2" } },
    role: "CTO",
    linkedin: "https://linkedin.com/in/janesmith",
    twitter: "https://twitter.com/janesmith"
  },
  {
    _id: "3",
    name: "Mike Johnson",
    image: { asset: { _ref: "image-3" } },
    role: "Lead Developer",
    linkedin: "https://linkedin.com/in/mikejohnson",
    twitter: "https://twitter.com/mikejohnson"
  },
  {
    _id: "4",
    name: "Emily Brown",
    image: { asset: { _ref: "image-4" } },
    role: "Marketing Manager",
    linkedin: "https://linkedin.com/in/emilybrown",
    twitter: "https://twitter.com/emilybrown"
  },
  {
    _id: "5",
    name: "David Lee",
    image: { asset: { _ref: "image-5" } },
    role: "Financial Analyst",
    linkedin: "https://linkedin.com/in/davidlee",
    twitter: "https://twitter.com/davidlee"
  },
  {
    _id: "6",
    name: "Sarah Wilson",
    image: { asset: { _ref: "image-6" } },
    role: "Customer Support Lead",
    linkedin: "https://linkedin.com/in/sarahwilson",
    twitter: "https://twitter.com/sarahwilson"
  }
];


const TeamCard = () => {
    return (
        <div className="div">
            <h1 className="relative z-10 text-2xl md:text-4xl text-center py-2 md:py-4  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">Awesome COIN SPECTRUM TEAM</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyAgents.map((agent) => ( 
          <div key={agent._id} className="group relative overflow-hidden rounded-lg shadow-lg bg-slate-900 mb-4">
            <img
              alt={agent.name}
              className="h-[300px] w-full object-cover transition-all duration-300 group-hover:scale-105"
              src={`https://via.placeholder.com/300x300?text=${agent.name}`}
            />
            <div className="p-4">
              <h3 className="text-xl md:text-3xl font-semibold">{agent.name}</h3>
              <p className="text-gray-400 md:text-xl">{agent.role}</p> 
              <div className="mt-4 flex items-center justify-between">
                <button className="btn btn-sm btn-ghost text-blue-600">Contact</button>
                <div className="flex items-center gap-2">
                  <a className="text-gray-400 hover:text-gray-50" href={agent.linkedin} target="_blank" rel="noopener noreferrer">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a className="text-gray-400 hover:text-gray-50" href={agent.twitter} target="_blank" rel="noopener noreferrer">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="px-6 pt-4 pb-2">
              <button className="w-full justify-center border border-gray-300 rounded-md py-2 md:text-2xl text-white flex flex-row items-center align-middle" aria-label="Email">
                <MailOpenIcon className="mr-2 text-white" />
                Email Me
              </button>
            </div>
          </div>
        ))}
      </div>
        </div>
    
    );
  };
  
  export default TeamCard;
