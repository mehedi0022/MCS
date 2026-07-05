import ResetPasswordPage from "@/components/auth/ResetPassword"
import React, { Suspense } from "react"

const page = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <ResetPasswordPage />
      </Suspense>
    </div>
  )
}

export default page
