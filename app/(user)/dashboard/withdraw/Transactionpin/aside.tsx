'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useFormState, useFormStatus } from 'react-dom'
import { updateUserPin } from '@/app/_action/pin-actions'
import Loader from '@/components/loader'
import { toast } from 'sonner'

export function PinManagement({ hasExistingPin }: { hasExistingPin: boolean }) {
  const [pin, setPin] = useState<string[]>(Array(4).fill(''))
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(4).fill(''))
  const [currentPin, setCurrentPin] = useState<string[]>(Array(4).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(12).fill(null))
  const [state, formAction] = useFormState(updateUserPin.bind(null, hasExistingPin), {
    success: false,
    error: null
  })

  useEffect(() => {
    if (state.success) {
      toast.success(`PIN ${hasExistingPin ? 'updated' : 'created'} successfully!`)
      setPin(Array(4).fill(''))
      setConfirmPin(Array(4).fill(''))
      if (hasExistingPin) setCurrentPin(Array(4).fill(''))
      inputsRef.current[0]?.focus()
    }
    if (state.error) toast.error(state.error)
  }, [state, hasExistingPin])

  const handleInputChange = (
    value: string,
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    groupIndex: number
  ) => {
    if (/^\d+$/.test(value)) {
      // Handle paste event
      if (value.length === 4) {
        const pastedDigits = value.split('').slice(0, 4)
        setter(pastedDigits)
        inputsRef.current[groupIndex * 4 + 3]?.focus()
        return
      }

      if (/^\d$/.test(value)) {
        setter(prev => {
          const newPin = [...prev]
          newPin[index] = value
          return newPin
        })

        if (index < 3) {
          inputsRef.current[groupIndex * 4 + index + 1]?.focus()
        }
      }
    } else if (value === '') {
      setter(prev => {
        const newPin = [...prev]
        newPin[index] = ''
        return newPin
      })

      if (index > 0) {
        inputsRef.current[groupIndex * 4 + index - 1]?.focus()
      }
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
          <PinInputGroup
            label="Current PIN"
            values={currentPin}
            onChange={(i, v) => handleInputChange(v, i, setCurrentPin, 0)}
            name="currentPin"
            inputsRef={inputsRef}
            groupIndex={0}
          />
        )}

        <PinInputGroup
          label={hasExistingPin ? 'New PIN' : 'Create PIN'}
          values={pin}
          onChange={(i, v) => handleInputChange(v, i, setPin, 1)}
          name="pin"
          inputsRef={inputsRef}
          groupIndex={1}
        />

        <PinInputGroup
          label="Confirm PIN"
          values={confirmPin}
          onChange={(i, v) => handleInputChange(v, i, setConfirmPin, 2)}
          name="confirmPin"
          inputsRef={inputsRef}
          groupIndex={2}
        />

        <SubmitButton hasExistingPin={hasExistingPin} />
        
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

function PinInputGroup({
  label,
  values,
  onChange,
  name,
  inputsRef,
  groupIndex
}: {
  label: string
  values: string[]
  onChange: (index: number, value: string) => void
  name: string
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>
  groupIndex: number
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-4"
    >
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-2 justify-center">
        {values.map((digit, i) => (
          <input
            key={i}
            ref={el => inputsRef.current[groupIndex * 4 + i] = el}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => {
              const value = e.target.value
              if (value === '' || /^[0-9]$/.test(value)) {
                onChange(i, value)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && digit === '') {
                onChange(i, '')
                if (i > 0) {
                  inputsRef.current[groupIndex * 4 + i - 1]?.focus()
                }
              }
            }}
            className="w-12 h-12 text-center border-2 rounded-lg focus:ring-2 focus:ring-primary transition-all duration-150 ease-in-out"
            autoComplete="one-time-code"
            aria-label={`${label} digit ${i + 1}`}
          />
        ))}
      </div>
      <input 
        type="hidden" 
        name={name}
        value={values.join('')}
        aria-hidden="true"
      />
    </motion.div>
  )
}

function SubmitButton({ hasExistingPin }: { hasExistingPin: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg font-semibold transition-transform hover:scale-[1.02] active:scale-98"
      disabled={pending}
    >
      {pending ? <Loader className="h-6 w-6 animate-spin" /> : 
      hasExistingPin ? 'Update PIN' : 'Create PIN'}
    </Button>
  )
}
