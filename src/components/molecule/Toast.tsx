import { useState, useEffect } from "react";

interface ToastProps {
  message: string | undefined;
  type: "success" | "error";
  duration?: number;
}

const Toast = ({ message, type, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`min-w-[300px]  fixed top-4 sm:right-4 sm:translate-x-0 right-1/2 translate-x-1/2 p-4 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
