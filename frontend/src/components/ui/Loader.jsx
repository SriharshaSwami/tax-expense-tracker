import React from 'react'
import { motion } from 'framer-motion'

// Elegant spinning circle loader
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }

  return (
    <div className={`animate-spin rounded-full border-emerald-500 border-t-transparent ${sizes[size]} ${className}`} />
  )
}

// Skeleton loading layout primitive
export const Skeleton = ({
  height = 'h-4',
  width = 'w-full',
  circle = false,
  className = ''
}) => {
  return (
    <div
      className={`
        animate-pulse bg-slate-200/80 dark:bg-slate-800/80
        ${circle ? 'rounded-full' : 'rounded-xl'}
        ${height} ${width} ${className}
      `}
    />
  )
}

// Full page loader transition overlay
export const FullPageLoader = ({ label = 'Processing Request' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFDFD] relative overflow-hidden"
    >
      <style>{`
        /* --- REPLICATED LOADER CSS --- */
        .loader {
          position: absolute;
          top: 50%;
          margin-left: -50px;
          left: 50%;
          animation: speeder 0.4s linear infinite;
          z-index: 10;
        }

        .loader > span {
          height: 5px;
          width: 35px;
          background: #000;
          position: absolute;
          top: -19px;
          left: 60px;
          border-radius: 2px 10px 1px 0;
        }

        .base span {
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 100px solid #000;
          border-bottom: 6px solid transparent;
        }

        .base span:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #000;
          position: absolute;
          right: -110px;
          top: -16px;
        }

        .base span:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid #000;
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
        }

        .face {
          position: absolute;
          height: 12px;
          width: 20px;
          background: #000;
          border-radius: 20px 20px 0 0;
          transform: rotate(-40deg);
          right: -125px;
          top: -15px;
        }

        .face:after {
          content: "";
          height: 12px;
          width: 12px;
          background: #000;
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
        }

        .loader > span > span:nth-child(1),
        .loader > span > span:nth-child(2),
        .loader > span > span:nth-child(3),
        .loader > span > span:nth-child(4) {
          width: 30px;
          height: 1px;
          background: #000;
          position: absolute;
          animation: fazer1 0.2s linear infinite;
        }

        .loader > span > span:nth-child(2) {
          top: 3px;
          animation: fazer2 0.4s linear infinite;
        }

        .loader > span > span:nth-child(3) {
          top: 1px;
          animation: fazer3 0.4s linear infinite;
          animation-delay: -1s;
        }

        .loader > span > span:nth-child(4) {
          top: 4px;
          animation: fazer4 1s linear infinite;
          animation-delay: -1s;
        }

        @keyframes fazer1 {
          0% { left: 0; }
          100% { left: -80px; opacity: 0; }
        }
        @keyframes fazer2 {
          0% { left: 0; }
          100% { left: -100px; opacity: 0; }
        }
        @keyframes fazer3 {
          0% { left: 0; }
          100% { left: -50px; opacity: 0; }
        }
        @keyframes fazer4 {
          0% { left: 0; }
          100% { left: -150px; opacity: 0; }
        }

        @keyframes speeder {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(-1deg); }
          20% { transform: translate(-2px, 0px) rotate(1deg); }
          30% { transform: translate(1px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 3px) rotate(-1deg); }
          60% { transform: translate(-1px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-2px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        .longfazers {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .longfazers span {
          position: absolute;
          height: 2px;
          width: 20%;
          background: #000;
          opacity: 0.1;
        }

        .longfazers span:nth-child(1) {
          top: 20%;
          animation: lf 0.6s linear infinite;
          animation-delay: -5s;
        }

        .longfazers span:nth-child(2) {
          top: 40%;
          animation: lf2 0.8s linear infinite;
          animation-delay: -1s;
        }

        .longfazers span:nth-child(3) {
          top: 60%;
          animation: lf3 0.6s linear infinite;
        }

        .longfazers span:nth-child(4) {
          top: 80%;
          animation: lf4 0.5s linear infinite;
          animation-delay: -3s;
        }

        @keyframes lf { 0% { left: 200%; } 100% { left: -200%; opacity: 0; } }
        @keyframes lf2 { 0% { left: 200%; } 100% { left: -200%; opacity: 0; } }
        @keyframes lf3 { 0% { left: 200%; } 100% { left: -100%; opacity: 0; } }
        @keyframes lf4 { 0% { left: 200%; } 100% { left: -100%; opacity: 0; } }

        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
        
        @keyframes customProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Background Texture */}
      <div className="absolute inset-0 noise-bg pointer-events-none"></div>

      {/* Long Fazers Background */}
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Loader Component Container */}
      <div className="relative w-full max-w-2xl h-[300px] flex items-center justify-center">
        <div className="loader">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div className="base">
            <span></span>
            <div className="face"></div>
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="z-20 text-center mt-4 space-y-4">
        <h1 className="font-space text-3xl font-bold tracking-tighter text-black uppercase animate-pulse" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {label}
        </h1>
        <p className="font-outfit text-gray-400 font-bold tracking-widest uppercase text-[10px]" style={{ fontFamily: '"Outfit", sans-serif' }}>
          Synchronizing with global neural networks
        </p>

        {/* Progress Bar Mockup */}
        <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto mt-12 overflow-hidden relative">
          <div className="h-full bg-black w-1/3 animate-[customProgress_3s_ease-in-out_infinite]" style={{ animationName: 'customProgress' }}></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-12 flex flex-col items-start space-y-2 opacity-40 hidden md:flex">
        <div className="flex items-center space-x-2 text-[10px] font-space" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-black font-bold">SYSTEMS NOMINAL</span>
        </div>
        <div className="text-[10px] font-outfit text-gray-500 uppercase tracking-tighter font-bold" style={{ fontFamily: '"Outfit", sans-serif' }}>
          X-RAY DELTA 4.0 // VECTOR PROTOCOL
        </div>
      </div>

      <div className="absolute top-12 right-12 text-right opacity-40 hidden md:block">
        <div className="text-2xl text-black mb-2 flex justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
        </div>
        <div className="text-[10px] font-space text-black font-bold uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          LATENCY: 14ms
        </div>
      </div>

      {/* Branding */}
      <div className="absolute top-12 left-12 hidden md:block">
        <div className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span className="font-space text-xl font-bold tracking-tighter text-black" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>VELOCITY</span>
        </div>
      </div>
    </motion.div>
  )
}

// Visual pre-built Card loader skeleton
export const CardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-fin-sm space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton height="h-10" width="w-10" circle />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-4" width="w-1/3" />
          <Skeleton height="h-3" width="w-1/2" />
        </div>
      </div>
      <div className="space-y-2.5 pt-4">
        <Skeleton height="h-6" width="w-full" />
        <Skeleton height="h-4" width="w-5/6" />
        <Skeleton height="h-4" width="w-2/3" />
      </div>
    </div>
  )
}

const Loader = {
  Spinner,
  Skeleton,
  FullPageLoader,
  CardSkeleton
}

export default Loader
