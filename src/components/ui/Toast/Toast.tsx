type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export default function Toast({ message, type = "success" }: ToastProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`fixed bottom-6 right-6 z-[70] max-w-sm px-4 py-3 text-sm font-medium ${
        type === "error" ? "toast-panel toast-panel-error" : "toast-panel"
      }`}
    >
      {message}
    </div>
  );
}
