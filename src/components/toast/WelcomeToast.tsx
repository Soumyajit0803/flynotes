"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function WelcomeToast() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // 1. Wait until NextAuth definitively confirms the user is logged in
    if (status === "authenticated" && session?.user) {
      
      // 2. Check the browser's temporary memory to see if we already greeted them
      const hasWelcomed = sessionStorage.getItem("hasWelcomed");
      
      if (!hasWelcomed) {
        // 3. Fire the toast!
        const firstName = session.user.name?.split(" ")[0] || "friend";
        toast.success(`Welcome, ${firstName}!`);
        
        // 4. Leave a note in the browser so we don't spam them on every page navigation
        sessionStorage.setItem("hasWelcomed", "true");
      }
    } 
    // 5. If they log out, clean up the memory so they get greeted next time
    else if (status === "unauthenticated") {
      sessionStorage.removeItem("hasWelcomed");
    }
  }, [status, session]);

  return null; // This component remains invisible
}