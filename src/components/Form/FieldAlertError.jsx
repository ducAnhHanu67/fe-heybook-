import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function FieldAlertError({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) return null
  return (
    <Alert
      variant="destructive"
      className="mt-[-15px] rounded-none rounded-b-lg border-[#fff0fd] bg-[#fff0fd] px-3 pt-4 pb-2"
    >
      <AlertCircle
        strokeWidth={2.2}
        className="mt-[1px] h-4 w-4 font-extrabold"
      />
      <AlertDescription className="font-medium">
        {errors[fieldName]?.message}
      </AlertDescription>
    </Alert>
  )
}
