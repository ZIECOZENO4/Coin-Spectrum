'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

export default function LicenseCards() {
  // License details array that can be easily modified
  const licenseDetails = [
    {
      id: 1,
      refNo: "MC 22385",
      company: "Financial Entity 1 LLC",
      state: "UNITED STATES, ALABAMA",
      department: "State Banking Department",
      licenseType: "Consumer Credit License",
      website: "https://www.banking.alabama.gov"
    },
   
    {
        id: 1,
        refNo: "MC 22385",
        company: "Financial Entity 1 LLC",
        state: "UNITED STATES, ALABAMA",
        department: "State Banking Department",
        licenseType: "Consumer Credit License",
        website: "https://www.banking.alabama.gov"
      },
      {
        id: 1,
        refNo: "MC 22385",
        company: "Financial Entity 1 LLC",
        state: "UNITED STATES, ALABAMA",
        department: "State Banking Department",
        licenseType: "Consumer Credit License",
        website: "https://www.banking.alabama.gov"
      },
  ]

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {licenseDetails.map((license, index) => (
          <motion.div
            key={license.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
          >
            <Card className="overflow-hidden bg-yellow-300 border-none">
              <CardContent className="p-6">
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-black rounded-full flex items-center justify-center"
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center">
                      <div className="text-black text-xl font-bold">{license.id}</div>
                    </div>
                  </motion.div>

                  <div className="text-center space-y-4">
                    <motion.h1 
                      className="text-xl font-bold text-black"
                      animate={{
                        scale: [1, 1.02, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {license.state}
                    </motion.h1>
                    
                    <motion.h2 
                      className="text-2xl font-bold text-black"
                      animate={{ 
                        y: [0, -2, 2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                      }}
                    >
                      {license.department}
                    </motion.h2>

                    <motion.div
                      className="bg-black text-yellow-300 p-3 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg font-semibold">{license.licenseType}</h3>
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      animate={{
                        x: [0, 3, -3, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                      }}
                    >
                      <p className="text-black font-medium">REFERENCE NO.</p>
                      <p className="text-xl font-bold text-black">{license.refNo}</p>
                    </motion.div>

                    <motion.div
                      className="bg-black text-yellow-300 p-2 rounded-md mt-4"
                      whileHover={{ 
                        scale: 1.05,
                        rotateX: [0, 10, -10, 0]
                      }}
                    >
                      <p className="font-medium">COMPANY</p>
                      <p className="font-bold">{license.company}</p>
                    </motion.div>
                  </div>

                  <motion.div
                    className="text-black text-sm mt-2"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    {license.website}
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
