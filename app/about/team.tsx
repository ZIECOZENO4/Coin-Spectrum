"use client";
import React from 'react';
import { MailOpenIcon } from '@/components/icons/Icons';

const dummyAgents = [
  {
    _id: "1",
    name: "STEVEN HATZAKIS",
    image: '/ab1.jpg',
    role: "CEO",
    mail:"Stevenhatzakistrading@gmail.com",
  },
  {
    _id: "2",
    name: "JOEY SHADECK",
    image: '/ab2.jpg',
    role: "Senior Investor",
    mail:"Stevenhatzakistrading@gmail.com",
  },
  {
    _id: "3",
    name: "JEFF ANBERG",
    image: '/ab3.jpg',
    role: "Senior Trader",
    mail:"Stevenhatzakistrading@gmail.com",
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
              src={agent.image}
            />
            <div className="p-4">
              <h3 className="text-xl md:text-3xl font-semibold">{agent.name}</h3>
              <p className="text-gray-400 md:text-xl">{agent.role}</p> 
              <div className="mt-4 flex items-center justify-between">
                <button className="btn btn-sm btn-ghost text-blue-600">Contact</button>
      
              </div>
            </div>
            <div className="px-6 pt-4 pb-2">
            <a href={`mailto:${agent.mail}?subject=Inquiry&body=Hello, am an investor on Coin Spectrum`}>
    <button 
      className="w-full justify-center border border-gray-300 rounded-md py-2 md:text-2xl text-white flex flex-row items-center align-middle" 
      aria-label="Email"
    >
      <MailOpenIcon className="mr-2 text-white" />
      Email Me
    </button>
  </a>
</div>
          </div>
        ))}
      </div>
        </div>
    
    );
  };
  
  export default TeamCard;
