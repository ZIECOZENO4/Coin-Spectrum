'use client'
import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../lib/auth/motion";
import Starter from "./Starter";

const Plan = () => {

 return (
    <div className="justify-center flex flex-col mt-4 md:mt-8  align-middle items-center py-[40px] ">
      <motion.div variants={textVariant()}>
     
        <h2 className='px-2 text-yellow-500 text-center font-black sm:text-[30px] xs:text-[40px] text-[20px] md:text-[60px]'>COIN SPECTRUM <span className="text-[#FFD700] ">INVESTMENT</span> PLANS.</h2>
      </motion.div>
    <p className='p-2 text-center text-slate-400 text-md md:text-xl'> Well Profitable investment plan, start earning from your first day in the crypto world, only on COIN Spectrum.</p> 
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
      </motion.p>
<div> 
    <div>
    <div>
  
  
<Starter />
 </div>
    </div>
    </div>  
     </div>

 );
};

export default Plan;

