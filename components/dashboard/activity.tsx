"use client"

import { useUser, useSession, useSessionList } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Clock, Monitor } from 'lucide-react'
import { useEffect, useState } from "react"

interface LoginActivity {
  id: string
  browserName: string
  deviceType: string
  ipAddress: string
  timestamp: Date
  lastActiveAt: Date
}

interface BrowserInfo {
  browser: string
  os: string
  deviceType: string
}

const getBrowserInfo = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    return { browser: 'Unknown', os: 'Unknown', deviceType: 'Unknown' }
  }

  const userAgent = window.navigator.userAgent
  let browser = 'Unknown'
  let os = 'Unknown'
  let deviceType = 'Desktop'

  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome'
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari'
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox'
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge'
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) browser = 'IE'

  // Detect OS
  if (userAgent.indexOf('Windows') > -1) os = 'Windows'
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS'
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux'
  else if (userAgent.indexOf('Android') > -1) os = 'Android'
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS'

  // Detect device type
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    deviceType = 'Mobile'
  } else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = 'Tablet'
  }

  return { browser, os, deviceType }
}

export default function LoginActivities() {
  const { user } = useUser()
  const { session } = useSession()
  const { sessions } = useSessionList()
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({ 
    browser: 'Unknown', 
    os: 'Unknown', 
    deviceType: 'Unknown' 
  })

  useEffect(() => {
    setBrowserInfo(getBrowserInfo())
  }, [])

  const activities: LoginActivity[] = sessions?.map(session => {
    const isCurrentSession = session.id === session?.id
    return {
      id: session.id,
      browserName: isCurrentSession 
        ? `${browserInfo.browser} on ${browserInfo.os}`
        : 'Other Browser',
      deviceType: isCurrentSession ? browserInfo.deviceType : 'Unknown Device',
      ipAddress: isCurrentSession ? 'Current Session' : 'Previous Session',
      timestamp: new Date(session.createdAt),
      lastActiveAt: new Date(session.lastActiveAt)
    }
  }) || []

  return (
    <div className="rounded-lg bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative">
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
                  className="relative mb-6 last:mb-0"
                >
                  <div className="flex items-start space-x-4">
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
                        className={`w-3 h-3 rounded-full ${
                          activity.id === session?.id 
                            ? "bg-green-500" 
                            : "bg-blue-500"
                        }`}
                      />
                      <span className="text-gray-400">
                        {activity.timestamp.toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit'
                        })}
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-2 text-gray-500"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Last active: {activity.lastActiveAt.toLocaleTimeString()}
                      </span>
                    </motion.div>
                  </div>

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
                      {activity.id === session?.id && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </motion.div>
                    
                    <motion.p
                      whileHover={{ x: 10 }}
                      className="text-gray-500 text-sm ml-7"
                    >
                      {activity.deviceType} • {activity.ipAddress}
                    </motion.p>
                  </motion.div>

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
