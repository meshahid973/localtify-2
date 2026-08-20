import { useEffect, useState } from "react";
import { inspectRuntime, type RuntimeState } from "./startup";
import styles from "./App.module.css";

const INITIAL_STATE: RuntimeState = { kind: "checking" };

export function App() {
  const [runtime, setRuntime] = useState<RuntimeState>(INITIAL_STATE);

  useEffect(() => {
    let mounted = true;

    void inspectRuntime().then((state) => {
      if (mounted) {
        setRuntime(state);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className={styles.shell}>
      <section className={styles.card} aria-label="Localtify application shell">
        <div className={styles.wordmark}>localtify</div>
        <p className={styles.subtitle}>local music, native and lightweight.</p>
        <RuntimeIndicator runtime={runtime} />
      </section>
    </main>
  );
}

function RuntimeIndicator({ runtime }: { runtime: RuntimeState }) {
  if (runtime.kind === "ready") {
    return (
      <span className={styles.status}>
        native core ready · v{runtime.app.version}
      </span>
    );
  }

  if (runtime.kind === "browser") {
    return <span className={styles.status}>web preview</span>;
  }

  if (runtime.kind === "error") {
    return <span className={styles.statusError}>native core unavailable</span>;
  }

  return <span className={styles.status}>starting native core…</span>;
}
