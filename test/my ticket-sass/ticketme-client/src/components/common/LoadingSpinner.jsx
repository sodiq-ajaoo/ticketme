function LoadingSpinner({ text = 'Loading your experience...' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {/* Logo */}

      <h1 className="mb-10 text-5xl font-black tracking-tight">
        <span className="text-blue-600">Ticket</span>

        <span className="text-slate-900 dark:text-white">Me</span>
      </h1>

      {/* Spinner */}

      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-slate-700"></div>

        <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <p className="mt-8 text-lg font-medium text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}

export default LoadingSpinner;
