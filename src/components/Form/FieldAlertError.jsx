import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
// import get from 'lodash/get'
// const error = get(errors, fieldName)?.message

export default function FieldAlertError({ errors, fieldName }) {
  // tự viết helper simple để resolve nested
  const getError = (errorsObj, path) => {
    return path.split('.').reduce((obj, key) => (obj && obj[key] ? obj[key] : null), errorsObj)
  }
  const error = getError(errors, fieldName)?.message
  if (!error) return null

  return (
    <Alert
      variant="destructive"
      className="mt-[-15px] rounded-none rounded-b-lg border-[#fff0fd] bg-[#fff0fd] px-3 pt-4 pb-2"
    >
      <AlertCircle strokeWidth={2.2} className="mt-[1px] h-4 w-4 font-extrabold" />
      <AlertDescription className="font-medium">{error}</AlertDescription>
    </Alert>
  )
}
