// function HeroPoster() {
//   return (
//     <div className="flex justify-center">
//       <div className="relative">
//         <div className="h-[500px] w-[360px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 shadow-2xl">
//           <div className="flex h-full items-center justify-center">
//             <h2 className="text-4xl font-black text-white">HERO IMAGE</h2>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HeroPoster;

import FloatingBadge from './FloatingBadge';

function HeroPoster() {
  return (
    <div className="relative">
      <div className="h-[420px] w-[320px] overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-2xl">
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white">
            <p className="text-sm uppercase tracking-[6px] opacity-80">
              Featured Event
            </p>

            <h2 className="mt-4 text-5xl font-black">SUMMER</h2>

            <h2 className="text-5xl font-black">FEST</h2>

            <p className="mt-6 text-lg">July 28 • Lagos</p>
          </div>
        </div>
      </div>

      <FloatingBadge label="VIP" className="-left-10 top-10" />

      <FloatingBadge
        label="LIVE NOW"
        color="bg-emerald-500"
        className="-right-8 top-24"
      />

      <FloatingBadge
        label="EARLY BIRD"
        color="bg-violet-600"
        className="bottom-16 -left-12"
      />

      <FloatingBadge
        label="$40"
        color="bg-amber-500"
        className="-right-10 bottom-6"
      />
    </div>
  );
}

export default HeroPoster;
