import { LoaderCircle } from 'lucide-react';

function Spinner({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <LoaderCircle size={52} className="animate-spin text-blue-600" />

      <p className="text-lg font-semibold text-slate-500">{text}</p>
    </div>
  );
}

export default Spinner;
