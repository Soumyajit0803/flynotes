import Link from "next/link";
import ThemeToggle from "../buttons/toggle/ThemeToggle";
import styles from "./navbar.module.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ContactRound, HomeIcon, NotebookPen } from "lucide-react";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <h1>FlyNotes</h1>
      <div className={styles.links}>
        <ThemeToggle />

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "2.4rem", // Custom width
                  height: "2.4rem", // Custom height
                  border: "1px solid #000000",
                },
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              style={{
                color: `var(--foreground)`,
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
              {" "}
              <ContactRound size={18} /> Log in
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
