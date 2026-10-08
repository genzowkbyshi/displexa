"use client";

import React, { Suspense } from "react";
import OnboardingContent from "../onboarding/onboarding-content";

export default function SifremiUnuttumPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      }
    >
      <OnboardingContent defaultMode="forgot-password" />
    </Suspense>
  );
}
