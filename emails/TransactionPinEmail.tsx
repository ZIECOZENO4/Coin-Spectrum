// emails/TransactionPinEmail.tsx
import { Html, Body, Container, Text, Section } from '@react-email/components'

export function TransactionPinEmail({
  userName,
  pin,
  isUpdate
}: {
  userName: string
  pin: string
  isUpdate: boolean
}) {
  return (
    <Html>
      <Body>
        <Container>
          <Section>
            <Text className="text-xl">{isUpdate ? '🔒 PIN Updated' : '🔐 New Transaction PIN'}</Text>
            <Text>Hi {userName},</Text>
            <Text>Your transaction PIN has been {isUpdate ? 'updated' : 'created'}:</Text>
            <div className="flex gap-2 my-4">
              {pin.split('').map((d, i) => (
                <div key={i} className="p-2 border rounded">{d}</div>
              ))}
            </div>
            <Text className="text-sm text-gray-600">
              This PIN will be required for all transactions.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
