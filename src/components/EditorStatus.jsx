export default function EditorStatus({ status }) {
  if (!status) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      style={{
        color: status.type === "error" ? "#b42318" : "#16794c",
        margin: "0 0 1rem",
      }}
    >
      {status.message}
    </p>
  );
}
