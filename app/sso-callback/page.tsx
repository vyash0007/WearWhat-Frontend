"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard/wardrobe"
        signUpForceRedirectUrl="/dashboard/wardrobe"
      />
    </div>
  );
}
