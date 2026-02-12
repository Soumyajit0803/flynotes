import Link from "next/link";
import ThemeToggle from "../buttons/toggle/ThemeToggle";
import styles from "./navbar.module.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ContactRound } from "lucide-react";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <h1>FlyNotes</h1>
      <div className={styles.links}>
        <ul className={styles.navlinks}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes">Notes</Link>
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
              border: "none",
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
