'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useFormState } from 'react-dom'
import { updateUserPin } from '@/app/_action/pin-actions'
import Loader from '@/components/loader'

export function PinManagement({ hasExistingPin }: { hasExistingPin: boolean }) {
  const [pin, setPin] = useState<string[]>(Array(4).fill(''))
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(4).fill(''))
  const [currentPin, setCurrentPin] = useState<string[]>(Array(4).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const [step, setStep] = useState(hasExistingPin ? 'current' : 'create')
  const [state, formAction] = useFormState(updateUserPin, { success: false, error: null })

  const handleInputChange = (value: string, index: number, setter: Function) => {
    if (/^\d$/.test(value) || value === '') {
      const newPin = [...setter === setCurrentPin ? currentPin : setter === setPin ? pin : confirmPin]
      newPin[index] = value
      setter([...newPin])

      if (value && index < 3) inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        {hasExistingPin ? 'Update Transaction PIN' : 'Create Transaction PIN'}
      </h2>

      <form action={formAction} className="space-y-8">
        {hasExistingPin && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium">Current PIN</label>
            <div className="flex gap-2 justify-center">
              {currentPin.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputsRef.current[i] = el}
                  type="password"
                  maxLength={1}
                  name="currentPin"
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, i, setCurrentPin)}
                  className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium">
            {hasExistingPin ? 'New PIN' : 'Create PIN'}
          </label>
          <div className="flex gap-2 justify-center">
            {pin.map((digit, i) => (
              <input
                key={i}
                type="password"
                maxLength={1}
                name="newPin"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, i, setPin)}
                className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium">Confirm PIN</label>
          <div className="flex gap-2 justify-center">
            {confirmPin.map((digit, i) => (
              <input
                key={i}
                type="password"
                maxLength={1}
                name="confirmPin"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, i, setConfirmPin)}
                className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>
        </motion.div>

        <input type="hidden" name="pin" value={pin.join('')} />
        <input type="hidden" name="confirmPin" value={confirmPin.join('')} />
        {hasExistingPin && <input type="hidden" name="currentPin" value={currentPin.join('')} />}

        <Button
          type="submit"
          className="w-full"
          disabled={state.pending}
        >
          {state.pending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : hasExistingPin ? 'Update PIN' : 'Create PIN'}
        </Button>

        {state.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {state.error}
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}
