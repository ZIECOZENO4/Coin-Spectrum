import { motion } from "framer-motion"
import { Check } from 'lucide-react'

interface ProgressStepsProps {
  currentStep: number
  steps: string[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 
                ${index < currentStep ? 'bg-blue-500' : 
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-200'}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={`text-sm ${index === currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {index + 1}
                </span>
              )}
            </motion.div>
            <span className="absolute top-10 text-xs text-gray-500 whitespace-nowrap">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

