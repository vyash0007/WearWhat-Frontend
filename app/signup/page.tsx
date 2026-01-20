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

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await signup({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setApiError(result.message || "Signup failed. Please try again.");
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
              Create your account
            </h1>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-gray-600 mb-1.5">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-50 border rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors ${
                      errors.firstName ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm text-gray-600 mb-1.5">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-50 border rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors ${
                      errors.lastName ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

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
                  className={`w-full px-4 py-3 text-gray-900 placeholder-gray-400 bg-gray-50 border rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
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
                    placeholder="Min 8 characters"
                    className={`w-full px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 bg-gray-50 border rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 bg-gray-50 border rounded-lg focus:outline-none focus:border-black focus:bg-white transition-colors ${
                      errors.confirmPassword ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <ShirtLoader size="sm" />
                    Creating account...
                  </span>
                ) : (
                  "Get started"
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

          {/* Sign in link */}
          <p className="text-center text-gray-600 mt-6">
            Already a member?{" "}
            <Link href="/login" className="underline font-medium text-black hover:text-gray-800">
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
