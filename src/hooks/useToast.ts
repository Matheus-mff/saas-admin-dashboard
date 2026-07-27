import { useEffect, useState } from "react";

type ToastType = "success" | "error";

export function useToast() {
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  function showToast(message: string, type: ToastType = "success") {
    setToastMessage(message);
    setToastType(type);
  }

  return {
    toastMessage,
    toastType,
    showToast,
  };
}