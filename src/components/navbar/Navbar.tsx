"use client";

import ThemeToggle from "../buttons/toggle/ThemeToggle";
import styles from "./navbar.module.css";
import { ContactRound, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  // 1. Grab the NextAuth session state
  const { data: session, status } = useSession();

  return (
    <nav className={styles.navbar}>
      <h1>FlyNotes</h1>
      <div className={styles.links}>
        <ThemeToggle />

        {/* 2. Show this if the user IS logged in */}
        {status === "authenticated" && session?.user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="Profile picture"
                width={38}
                height={38}
                style={{
                  borderRadius: "50%",
                  border: "1px solid var(--foreground)",
                  objectFit: "cover",
                }}
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                color: "var(--foreground)",
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "8px",
                opacity: 0.7,
                transition: "opacity 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.7")}
              title="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : null}

        {/* 3. Show this if the user is NOT logged in */}
        {status === "unauthenticated" ? (
          <button
            onClick={() => signIn("google")}
            style={{
              color: "var(--foreground)",
              background: "var(--background)",
              outline: "none",
              border: "1px solid var(--foreground)",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "100px",
            }}
          >
            <ContactRound size={18} /> Log in
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
