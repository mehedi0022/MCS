import { Suspense } from "react"
import LoginPage from "@/components/auth/Login"

const page = () => {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  )
}

export default page
