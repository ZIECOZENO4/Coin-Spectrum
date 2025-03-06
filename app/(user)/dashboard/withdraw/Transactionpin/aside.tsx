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
  const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null))
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

  const handleInputChange = (value: string, index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (/^\d$/.test(value)) {
      setter(prev => {
        const newPin = [...prev]
        newPin[index] = value
        return newPin
      })

      if (index < 3) {
        setTimeout(() => inputsRef.current[index + 1]?.focus(), 10)
      }
    } else if (value === '') {
      setter(prev => {
        const newPin = [...prev]
        newPin[index] = ''
        return newPin
      })

      if (index > 0) {
        setTimeout(() => inputsRef.current[index - 1]?.focus(), 10)
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
            onChange={(i, v) => handleInputChange(v, i, setCurrentPin)}
            name="currentPin"
            inputsRef={inputsRef}
            startIndex={0}
          />
        )}

        <PinInputGroup
          label={hasExistingPin ? 'New PIN' : 'Create PIN'}
          values={pin}
          onChange={(i, v) => handleInputChange(v, i, setPin)}
          name="pin"
          inputsRef={inputsRef}
          startIndex={hasExistingPin ? 4 : 0}
        />

        <PinInputGroup
          label="Confirm PIN"
          values={confirmPin}
          onChange={(i, v) => handleInputChange(v, i, setConfirmPin)}
          name="confirmPin"
          inputsRef={inputsRef}
          startIndex={hasExistingPin ? 8 : 4}
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
  startIndex
}: {
  label: string
  values: string[]
  onChange: (index: number, value: string) => void
  name: string
  inputsRef: React.MutableRefObject<(HTMLInputElement | null)[]>
  startIndex: number
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
            ref={el => inputsRef.current[startIndex + i] = el}
            type="password"
            inputMode="numeric"
            maxLength={1}
            name={name}
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            className="w-12 h-12 text-center border-2 rounded-lg focus:ring-2 focus:ring-primary"
            autoComplete="one-time-code"
          />
        ))}
      </div>
      <input type="hidden" name={name} value={values.join('')} />
    </motion.div>
  )
}

function SubmitButton({ hasExistingPin }: { hasExistingPin: boolean }) {
  const { pending } = useFormStatus()
  
  return (
    <Button
      type="submit"
      className="w-full h-12 text-lg font-semibold"
      disabled={pending}
    >
      {pending ? <Loader className="h-6 w-6 animate-spin" /> : 
      hasExistingPin ? 'Update PIN' : 'Create PIN'}
    </Button>
  )
}
