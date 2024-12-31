"use client";

import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/components/providers/react-query";
// import { SessionProvider } from "next-auth/react";

const Providers = ({ children }) => {
  return (
    // <SessionProvider>
      <TanstackProvider>
        <Toaster position="top-center" />
        {children}
      </TanstackProvider>
    // </SessionProvider>
  );
};

export default Providers;
