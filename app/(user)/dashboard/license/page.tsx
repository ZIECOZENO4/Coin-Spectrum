"use client"

import { motion } from "framer-motion"
import { Shield, Award, CheckCircle, Building2, Globe2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import LicenseCards from "./license-cards"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function CompanyLicense() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] bg-gradient-to-b from-yellow-400/20 to-black flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-20" />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative text-center space-y-4 p-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Company License
          </h1>
          <p className="text-xs text-zinc-300  mx-auto">
          In order to ensure the provision of their portfolio of services in full compliance with all applicable global and local regulations and standards, the COIN SPECTRUM companies hold licenses and registrations in numerous jurisdictions worldwide, and are constantly bringing their operations in line with newly adopted legislative changes.
          </p>
        </motion.div>
      </motion.div>

      {/* License Details */}
      <motion.div 
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <motion.div 
  
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <Card className="bg-zinc-900 border-yellow-400/20">
            <CardContent className="p-6 space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-lg bg-yellow-400/10 flex items-center justify-center"
              >
                <Shield className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">Licensed Entity</h3>
              <p className="text-zinc-400">
                Registered and regulated under strict financial authorities ensuring complete compliance and security.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-yellow-400/20">
            <CardContent className="p-6 space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-lg bg-yellow-400/10 flex items-center justify-center"
              >
                <Award className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">Certified Operations</h3>
              <p className="text-zinc-400">
                All trading operations are monitored and certified by international regulatory bodies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-yellow-400/20">
            <CardContent className="p-6 space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 rounded-lg bg-yellow-400/10 flex items-center justify-center"
              >
                <Globe2 className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">Global Compliance</h3>
              <p className="text-zinc-400">
                Meeting international standards and regulations for worldwide trading operations.
              </p>
            </CardContent>
          </Card>
        </motion.div>
<LicenseCards />
        {/* License Information */}
        <motion.div 
  
          className="mt-16 space-y-8"
        >
          <Card className="bg-zinc-900 border-yellow-400/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4"
                >
                  <Building2 className="w-8 h-8 text-yellow-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Company Registration</h3>
                    <p className="text-zinc-400">License Number: FX22-1234-5678</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <motion.div 
                   
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-medium text-white">Regulatory Compliance</h4>
                    <ul className="space-y-3">
                      {[
                        "Anti-Money Laundering (AML) Compliance",
                        "Know Your Customer (KYC) Verification",
                        "Financial Services Authority Regulated",
                        "Regular External Audits",
                        "Segregated Client Funds"
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 text-zinc-300"
                        >
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
             
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-medium text-white">Trading Security</h4>
                    <ul className="space-y-3">
                      {[
                        "256-bit SSL Encryption",
                        "Two-Factor Authentication (2FA)",
                        "Real-time Risk Monitoring",
                        "Automated Trade Verification",
                        "24/7 Security Surveillance"
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 text-zinc-300"
                        >
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Display */}
          <motion.div
    
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="bg-zinc-900 border-yellow-400/20">
              <CardContent className="p-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="aspect-[4/3] relative overflow-hidden rounded-lg"
                >
                  <img
                    src="https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0016.jpg"
                    alt="Trading License Certificate"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Trading License</h4>
                    <p className="text-sm text-zinc-300">Certificate of Authorization</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-yellow-400/20">
              <CardContent className="p-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="aspect-[4/3] relative overflow-hidden rounded-lg"
                >
                  <img
                    src="https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0018.jpg"
                    alt="Regulatory Compliance Certificate"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">Regulatory Compliance</h4>
                    <p className="text-sm text-zinc-300">International Certification</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

