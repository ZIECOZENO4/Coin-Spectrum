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
  const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null))
  const [state, formAction] = useFormState(updateUserPin, { success: false, error: null })

  // Auto-focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const handleInputChange = (value: string, index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (/^\d$/.test(value)) {
      setter(prev => {
        const newPin = [...prev]
        newPin[index] = value
        return newPin
      })

      // Move to next input after state update
      setTimeout(() => {
        if (index < 3) inputsRef.current[index + 1]?.focus()
      }, 10)
    } else if (value === '') {
      setter(prev => {
        const newPin = [...prev]
        newPin[index] = ''
        return newPin
      })

      // Move to previous input on backspace
      setTimeout(() => {
        if (index > 0) inputsRef.current[index - 1]?.focus()
      }, 10)
    }
  }

  const handlePaste = (e: React.ClipboardEvent, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 4)
    const newPin = Array(4).fill('')
    
    pasteData.split('').forEach((char, index) => {
      if (/^\d$/.test(char) && index < 4) {
        newPin[index] = char
      }
    })
    
    setter(newPin)
    setTimeout(() => {
      const firstEmpty = newPin.findIndex(v => v === '')
      inputsRef.current[firstEmpty === -1 ? 3 : firstEmpty]?.focus()
    }, 10)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium">Current PIN</label>
            <div className="flex gap-2 justify-center">
              {currentPin.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputsRef.current[i] = el}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  name="currentPin"
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, i, setCurrentPin)}
                  onPaste={(e) => handlePaste(e, setCurrentPin)}
                  className="w-12 h-12 text-center border-2 rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium">
            {hasExistingPin ? 'New PIN' : 'Create PIN'}
          </label>
          <div className="flex gap-2 justify-center">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={el => inputsRef.current[i + (hasExistingPin ? 4 : 0)] = el}
                type="password"
                inputMode="numeric"
                maxLength={1}
                name="newPin"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, i, setPin)}
                onPaste={(e) => handlePaste(e, setPin)}
                className="w-12 h-12 text-center border-2 rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150"
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <label className="block text-sm font-medium">Confirm PIN</label>
          <div className="flex gap-2 justify-center">
            {confirmPin.map((digit, i) => (
              <input
                key={i}
                ref={el => inputsRef.current[i + (hasExistingPin ? 8 : 4)] = el}
                type="password"
                inputMode="numeric"
                maxLength={1}
                name="confirmPin"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, i, setConfirmPin)}
                onPaste={(e) => handlePaste(e, setConfirmPin)}
                className="w-12 h-12 text-center border-2 rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150"
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </motion.div>

        <input type="hidden" name="pin" value={pin.join('')} />
        <input type="hidden" name="confirmPin" value={confirmPin.join('')} />
        {hasExistingPin && <input type="hidden" name="currentPin" value={currentPin.join('')} />}

        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold transition-all"
          disabled={state.pending}
        >
          {state.pending ? (
            <Loader className="h-6 w-6 animate-spin" />
          ) : hasExistingPin ? 'Update PIN' : 'Create PIN'}
        </Button>

        {state.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg"
          >
            {state.error}
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}
