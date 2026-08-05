function FloatingBadge({ label, color = 'bg-blue-600', className = '' }) {
  return (
    <div
      className={`absolute rounded-2xl ${color} px-4 py-2 shadow-xl backdrop-blur-md ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-white">
        {label}
      </p>
    </div>
  );
}

export default FloatingBadge;
