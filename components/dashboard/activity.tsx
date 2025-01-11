"use client"

import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Clock, Monitor } from 'lucide-react'

interface LoginActivity {
  id: string
  browserName: string
  deviceType: string
  ipAddress: string
  timestamp: Date
}

export default function LoginActivities() {
  const { user } = useUser()
  
  // In a real app, this would come from Clerk's session data
  const activities: LoginActivity[] = [
    {
      id: "1",
      browserName: "Chrome Windows 10",
      deviceType: "Desktop",
      ipAddress: "103.161.99.78",
      timestamp: new Date()
    }
  ]

  return (
    <div className="rounded-lg bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Login Activities
            </h2>

            <AnimatePresence>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-start space-x-4">
                    {/* Date indicator */}
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-3 h-3 bg-blue-500 rounded-full"
                      />
                      <span className="text-gray-400">
                        {activity.timestamp.toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit'
                        })}
                      </span>
                    </motion.div>

                    {/* Time indicator */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-2 text-gray-500"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date().getMinutes() < 2 ? '1 minute ago' : 
                         `${new Date().getMinutes()} minutes ago`}
                      </span>
                    </motion.div>
                  </div>

                  {/* Device info */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mt-4 space-y-2"
                  >
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center space-x-2 text-white"
                    >
                      <Monitor className="w-5 h-5 text-gray-400" />
                      <span>{activity.browserName}</span>
                    </motion.div>
                    
                    <motion.p
                      whileHover={{ x: 10 }}
                      className="text-gray-500 text-sm ml-7"
                    >
                      {activity.ipAddress}
                    </motion.p>
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -left-10 top-1/2 w-8 h-[1px] bg-gray-800"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0"
            animate={{
              opacity: [0, 0.1, 0],
              scale: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </Card>
      </motion.div>
    </div>
  )
}

