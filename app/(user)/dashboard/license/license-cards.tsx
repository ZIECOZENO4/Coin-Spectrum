'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Link } from 'lucide-react'

export default function LicenseCards() {
  // License details array that can be easily modified
  const licenseDetails = [
    {
   
      refNo: "31000201469839",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0009.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES",
      department: "U.S. Financial Crimes Enforcement Network",
      licenseType: "Money Service Business Registration",
      website: "https://www.fincen.gov"
    },
    {
      refNo: "MC 22385",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0010.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, ALABAMA",
      department: "State Banking Department",
      licenseType: "Consumer Credit License",
      website: "https://www.banking.alabama.gov"
    },
    {
      refNo: "MC 769",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0011.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, ALABAMA",
      department: "Alabama Securities Commission",
      licenseType: "Money Transmitter License",
      website: "https://www.asc.alabama.gov"
    },
    {
      refNo: "MT-1034818",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0013.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Arizona",
      department: "Department of Insurance and Financial Institutions",
      licenseType: "Money Transmitter License",
      website: "https://difi.az.gov"
    },
    {
      refNo: "CL-1017838",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0014.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Arizona",
      department: "Department of Insurance and Financial Institutions",
      licenseType: "Consumer Lender License",
      website: "https://difi.az.gov"
    },
    {
      refNo: "125678",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0015.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Arkansas",
      department: "Arkansas Securities Department",
      licenseType: "Money Transmitter License",
      website: "http://securities.arkansas.gov"
    },
    {
      refNo: "RRL-11385",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0016.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Idaho",
      department: "Department of Finance",
      licenseType: "Regulated Lender License",
      website: "https://www.finance.idaho.gov"
    },
    {
      refNo: "CI.0014461-H",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0017.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Illinois",
      department: "Department of Financial and Professional Regulation",
      licenseType: "Consumer Installment Loan License",
      website: "https://idfpr.com"
    },
    {
      refNo: "2022-0009",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0018.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Iowa",
      department: "Iowa Division of Banking",
      licenseType: "Money Service License",
      website: "http://www.idob.state.ia.us"
    },
    {
      refNo: "SL.0026405",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0019.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Kansas",
      department: "Office of the State Bank Commissioner",
      licenseType: "Supervised Loan License",
      website: "https://osbckansas.org"
    },
    {
      refNo: "03-1898745",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0021.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Maryland",
      department: "Commissioner of Financial Regulation",
      licenseType: "Installment Loan License",
      website: "https://www.maryland.gov/Pages/default.aspx/Pages/default.aspx"
    },
    {
      refNo: "MO-23-8913",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0022.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Missouri",
      department: "Division of Finance",
      licenseType: "Sale of Checks & Money Transmitter License",
      website: "https://finance.mo.gov"
    },
    {
      refNo: "1877754",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0023.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Montana",
      department: "Division of Banking and Financial Institutions",
      licenseType: "Consumer Loan License",
      website: "https://banking.mt.gov"
    },
    {
      refNo: "23521-SM",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0024.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, New Hampshire",
      department: "Banking Department",
      licenseType: "Small Loan Lender License",
      website: "https://www.nh.gov/banking"
    },
    {
      refNo: "MB104829",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0025.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, North Dakota",
      department: "Department of Financial Institutions",
      licenseType: "Money Broker License",
      website: "https://www.nh.gov/banking"
    },
    {
      refNo: "1998556",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0032.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Oregon",
      department: "Division of Financial Regulation",
      licenseType: "Consumer Finance License",
      website: "https://dfr.oregon.gov"
    },
    {
      refNo: "1878745.MT",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0030.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, South Dakota",
      department: "Division of Banking",
      licenseType: "Money Transmitter License",
      website: "https://dlr.sd.gov/banking/"
    },
    {
      refNo: "MC 22385",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0029.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Utah",
      department: "Department of Financial Institutions",
      licenseType: "Consumer Credit Notification",
      website: "https://dfi.utah.gov"
    },
    {
      refNo: "TC017446",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0025.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "Hong Kong",
      department: "Companies Registry",
      licenseType: "Trust or Company Service Provider License",
      website: "https://www.cr.gov.hk"
    },
    {
      refNo: "CL-4229",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0026.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "UNITED STATES, Wyoming",
      department: "Department of Audit",
      licenseType: "Consumer Lender License",
      website: "http://audit.wyo.gov"
    },
    {
      refNo: "M20280268",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0031.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "Canada",
      department: "Financial Transactions and Reports Analysis Centre of Canada",
      licenseType: "Money Service Business Registration",
      website: "https://www.fintrac-canafe.gc.ca"
    },
    {
      refNo: "647054530",
      image:'https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/IMG-20250115-WA0027.jpg',
      company: "Coin Spectrum Investments and Trades LLC",
      state: "Australia",
      department: "Australian Securities and Investment Commission",
      licenseType: "Registration as Foreign Company",
      website: "https://asic.gov.au"
    },
  ]

  return (
    <div className="min-h-screen bg-black p-2 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {licenseDetails.map((license, index) => (
          <motion.div
            key={license.refNo}
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
  className="w-full h-20 bg-black rounded-md flex items-center justify-center"
>
  <div className="w-full p-4 h-16 border-yellow-300 border rounded-md flex items-center justify-center relative">
    <img 
      alt='images' 
      src={license.image} 
      className='w-full h-full object-contain absolute inset-0'
    />
  </div>
</motion.div>


                  <div className="text-center space-y-4">
                    <motion.h1 
                      className="text-xl font-bold text-black uppercase"
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
                      className="text-xl font-bold text-black"
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
                    className="text-black text-sm mt-2 underline"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    <Link href={license.website}>
                    {license.website}
                    </Link>
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
