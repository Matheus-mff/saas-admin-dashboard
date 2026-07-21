type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export default function Toast({
  message,
  type = "success",
}: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 rounded-lg px-5 py-3 text-white shadow-lg transition-all ${
        type === "success"
          ? "bg-green-600"
          : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}