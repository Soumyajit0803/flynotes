import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Welcome to FlyNotes</h2>
      <p>
        <br />
        Your personal note-taking app built with Next.js and TypeScript.
        <br />
        Log in and take your notes the way you love.
      </p>
    </main>
  );
}
