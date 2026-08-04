import { useState } from "react";
import { Button } from "../components/Button";
import { FaExclamationTriangle, FaBug } from "react-icons/fa";

export const ErrorDemo = () => {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    // Deliberately throw a runtime render exception to test ErrorBoundary UX
    throw new Error("SyntaxError / RenderException: Triggered test error for UX demonstration.");
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "var(--code-bg, #1e293b)",
        border: "1px solid var(--border, #334155)",
        borderRadius: "16px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", color: "#fbbc05", marginBottom: "1rem" }}>
        <FaExclamationTriangle />
      </div>
      <h2 style={{ color: "var(--text-h, #f8fafc)", marginBottom: "0.75rem" }}>
        Error Handling UX Demo
      </h2>
      <p style={{ color: "var(--text, #94a3b8)", lineHeight: 1.6, marginBottom: "2rem" }}>
        This page demonstrates how the application handles syntax or runtime execution errors.
        Click the button below to trigger a test error and see the Error Boundary fallback UI in action.
      </p>

      <Button variant="danger" onClick={() => setShouldCrash(true)}>
        <FaBug /> Trigger Test Syntax/Runtime Error
      </Button>
    </div>
  );
};
