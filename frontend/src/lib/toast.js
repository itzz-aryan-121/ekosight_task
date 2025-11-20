import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message, description) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
      style: {
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(34, 197, 94, 0.5)",
        color: "#86efac",
      },
    });
  },
  error: (message, description) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
      style: {
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        color: "#fca5a5",
      },
    });
  },
  warning: (message, description) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
      style: {
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(255, 215, 0, 0.5)",
        color: "#fef08a",
      },
    });
  },
  info: (message, description) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
      style: {
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(59, 130, 246, 0.5)",
        color: "#93c5fd",
      },
    });
  },
  default: (message, description) => {
    sonnerToast(message, {
      description,
      duration: 4000,
      style: {
        background: "rgba(0, 0, 0, 0.9)",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        color: "#ffffff",
      },
    });
  },
};

