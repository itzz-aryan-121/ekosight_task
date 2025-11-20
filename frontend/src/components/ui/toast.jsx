import { Toaster as Sonner } from "sonner";

const Toaster = () => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black/90 group-[.toaster]:border-yellow-500/30 group-[.toaster]:text-white group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-white/70",
          actionButton:
            "group-[.toast]:bg-yellow-500 group-[.toast]:text-black group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-black/50 group-[.toast]:text-white group-[.toast]:border-white/10",
          success:
            "group-[.toaster]:bg-black/90 group-[.toaster]:border-green-500/50 group-[.toaster]:text-green-400",
          error:
            "group-[.toaster]:bg-black/90 group-[.toaster]:border-red-500/50 group-[.toaster]:text-red-400",
          warning:
            "group-[.toaster]:bg-black/90 group-[.toaster]:border-yellow-500/50 group-[.toaster]:text-yellow-400",
          info: "group-[.toaster]:bg-black/90 group-[.toaster]:border-blue-500/50 group-[.toaster]:text-blue-400",
        },
        style: {
          background: "rgba(0, 0, 0, 0.9)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          color: "#ffffff",
        },
      }}
    />
  );
};

export { Toaster };

