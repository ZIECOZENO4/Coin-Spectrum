"use client"
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (form.current) {
      emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        form.current,
        'YOUR_PUBLIC_KEY'
      )
        .then((result) => {
          setSubmitMessage('Message sent successfully!');
          if (form.current) form.current.reset();
        }, (error) => {
          setSubmitMessage('Failed to send message. Please try again.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" p-14 col-span-4"
    >
      <h2 className="mb-14 font-bold text-4xl text-yellow-500 before:block before:absolute before:bg-yellow-800 before:content-[''] relative before:w-20 before:h-1 before:-skew-y-3 before:-bottom-4">Get in Touch</h2>
      <form ref={form} onSubmit={sendEmail} className="space-y-6">
        <div className="grid gap-6 grid-cols-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              className="w-full py-4 bg-white rounded-full px-6 placeholder:text-xs"
              placeholder="Your name"
              name="user_name"
              required
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              className="w-full py-4 bg-white rounded-full px-6 placeholder:text-xs"
              placeholder="Your surname"
              name="user_surname"
              required
            />
          </motion.div>
        </div>
        <div className="grid gap-6 grid-cols-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              className="w-full py-4 bg-white rounded-full px-6 placeholder:text-xs"
              placeholder="Email address"
              name="user_email"
              type="email"
              required
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              className="w-full py-4 bg-white rounded-full px-6 placeholder:text-xs"
              placeholder="Subject"
              name="subject"
              required
            />
          </motion.div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <textarea
            className="w-full rounded-2xl placeholder:text-xs px-6 py-4"
            placeholder="Your message here"
            name="message"
            rows={8}
            required
          ></textarea>
        </motion.div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-yellow-500 text-white font-bold py-4 px-6 min-w-40 hover:bg-yellow-400 transition-all"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </motion.button>
        </div>
      </form>
      {submitMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-yellow-100"
        >
          {submitMessage}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ContactForm;
