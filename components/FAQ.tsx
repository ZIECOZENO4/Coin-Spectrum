"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const words = [
    {
      text: " Frequent Questions",
      className: "text-yellow-500 text-[30px] px-2 text-wrap font-bold text-center",
    },
  ];
  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };
  const faqData = [
    {
      question: 'CAN I LOG OUT FROM MY ACCOUNT OR DELETE MY ACCOUNT?',
      answer: 'Yes, you can log out from your account by clicking on the logout button in the account settings. To delete your account, please contact our support team for assistance.',
    },
    {
      question: 'HOW CAN I SEE WHO MY UPLINE IS?',
      answer: 'You can see who your upline is by logging into your account and navigating to the referral section. Your upline will be displayed there.',
    },
    {
      question: "WHAT IS THE MINIMUM AND MAXIMUM DEPOSIT ?",
      answer: "The minimum deposit amount is $100, and the maximum deposit amount is $100,000,000. You can make multiple deposits as long as they do not exceed the maximum limit.",
    },
    {
      question: "WHAT IS THE MINIMUM AND MAXIMUM AMOUNT FOR WITHDRAWAL?",
      answer: "The minimum withdrawal amount is $100, and the maximum withdrawal amount is $1,000,000. You can make multiple withdrawals as long as they do not exceed the maximum limit.",
    },
    {
      question: "WHAT IS THE MINIMUM AND MAXIMUM AMOUNT FOR INVESTMENT?",
      answer: "The minimum investment amount is $100, and the maximum investment amount is $1,000,000. You can make multiple investments as long as they do not exceed the maximum limit.",
    },
    {
      question: "CAN I JOIN THE COMPANY TEAM?",
      answer: "Yes, you can join the company team by applying for a job opening on our careers page. We are always looking for talented individuals to join our team.",
    }
  ];

  return (
    <div className=" mx-auto p-2  text-center text-white">
        <p  className=" text-md text-white -mb-1 font-bold">Find Answers</p>
      <TypewriterEffectSmooth words={words} />
      <p className=" text-xs text-white mb-3">Find answers to yours questions, by checking out the frequent questions asked by miners investors you.</p>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            className=" overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.button
              className={`w-full flex bg-yellow-800 bg-opacity-50 shadow-md rounded-lg text-white justify-between items-center p-6 focus:outline-none ${
                openIndex === index ? '' : ''
              }`}
              onClick={() => toggleAnswer(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-xl font-semibold">{faq.question}</h3>
              <svg
                className={`w-6 h-6 transition-transform rounded-full bg-yellow-500 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>
            {openIndex === index && (
              <motion.div
                className="p-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-white">{faq.answer}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
