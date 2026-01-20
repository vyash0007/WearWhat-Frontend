"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { Header } from "@/components/Header/header";
import { Footer } from "@/components/Footer/footer";
import { Button } from "@/components/ui/button";
import ShirtLoader from "@/components/ui/ShirtLoader";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login({ email, password });

    if (result.success) {
      router.push("/dashboard/wardrobe");
    } else {
      setError(result.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Logo */}
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>WearWhat</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Welcome back
            </h1>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <ShirtLoader size="sm" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-gray-500 mt-6 text-center">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-700">Terms of Use</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>.
            </p>
          </div>

          {/* Sign up link */}
          <p className="text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-medium text-black hover:text-gray-800">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
