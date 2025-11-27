"use client";

export default function NextJsLogo() {
  // Logo Next.js hanya muncul di development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <a
        href="https://nextjs.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-black/90"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 394 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-auto"
        >
          <path
            d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"
            fill="currentColor"
          />
        </svg>
        <span className="text-xs font-medium">Next.js</span>
      </a>
    </div>
  );
}
