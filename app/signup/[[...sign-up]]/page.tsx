"use client";

import { Header } from "@/components/Header/header";
import { Footer } from "@/components/Footer/footer";
import { CustomSignUp } from "@/components/auth/CustomSignUp";

export default function SignupPage() {
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CustomSignUp />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
