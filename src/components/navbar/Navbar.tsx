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
        <ul className={styles.navlinks}>
          <li>
            <Link style={{display: "flex", alignItems: "center", gap: "0.5rem"}} href="/"><HomeIcon size={18} /> Home</Link>
          </li>
          <li>
            <Link style={{display: "flex", alignItems: "center", gap: "0.5rem"}} href="/notes"><NotebookPen size={18} /> Notes</Link>
          </li>
        </ul>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button style = {{
              color: `var(--foreground)`,
              background: "var(--background)",
              outline: "none",
              border: "1px solid var(--foreground)",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "1rem",
              cursor: "pointer"
            }}> <ContactRound size={18} /> Log in</button>
          </SignInButton>
        </SignedOut>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
