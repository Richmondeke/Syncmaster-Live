import { redirect } from 'next/navigation'

// Redirect old radio-directory URL to the merged directory page
export default function RadioDirectoryRedirect() {
  redirect('/dashboard/directory')
}
