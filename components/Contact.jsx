// contact.tsx
"use client"
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Resend } from "resend";
import { styles } from "./styles";
import dynamic from "next/dynamic";
import { slideIn } from "./motion";
import { NotificationEmail } from "@/emails/NotificationEmail";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name === 'user_name' ? 'name' : name === 'user_email' ? 'email' : name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send email to Coin Spectrum
      await resend.emails.send({
        from: 'support@coinspectrum.net',
        to: 'support@coinspectrum.net',
        subject: `New Contact Form Submission from ${form.name}`,     
      });

      await resend.emails.send({
        from: 'support@coinspectrum.net',
        to: form.email,
        subject: 'Message Received - Coin Spectrum',
        react: NotificationEmail({
          userFirstName: form.name,
          userEmail: form.email,
          message: form.message,
          timestamp: new Date().toLocaleString()
        })
      });

      setLoading(false);
      alert(`Thank you, ${form.name}. Coin Spectrum will get back to you at ${form.email} as soon as possible.`);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`xl:mt-12 bg-slate-800 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] p-8 rounded-2xl'
      >
        <p className="sm:text-[18px] text-[14px] text-yellow-600 uppercase tracking-wider">
          Get in touch with Coin Spectrum
        </p>
        <h3 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] mb-4 md:mb-8 text-[30px]">
          Contact us for any complaints, suggestions or support.
        </h3>
       
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='user_name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='user_email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What you want to say or contribute?'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
            />
          </label>

          <button
            type='submit'
            className='bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 py-3 px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md shadow-primary transition duration-300 ease-in-out'
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
