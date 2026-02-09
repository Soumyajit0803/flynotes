import Link from "next/link";
import ThemeToggle from "../buttons/toggle/ThemeToggle";
import styles from "./navbar.module.css";

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
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
