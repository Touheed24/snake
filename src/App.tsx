/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Activity, Music } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    setCurrentScore(score);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500 selection:text-black flex flex-col font-sans overflow-hidden cursor-crosshair relative">
      {/* Glitch overlays */}
      <div className="fixed inset-0 pointer-events-none z-[100] static-noise" />
      <div className="fixed inset-0 pointer-events-none z-[101] scanline" />

      {/* Atmospheric glitches */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/10 animate-[pulse_2s_infinite]" />
        <div className="absolute bottom-1/4 -left-10 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 -right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b-2 border-white/10 bg-black/80 backdrop-blur-sm px-10 py-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-white p-3 rotate-45">
            <Activity className="w-10 h-10 text-black -rotate-45" />
          </div>
          <div>
            <h1 
              data-text="PROTO_SNAKE_V01"
              className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none font-mono text-white tear-effect cursor-none"
            >
              PROTO<span className="text-fuchsia-500">SNAKE</span>
            </h1>
            <p className="text-xs font-mono uppercase tracking-[0.6em] text-cyan-400 mt-2 opacity-50 underline decoration-fuchsia-500 underline-offset-4">KERNEL_STATE :: STABLE</p>
          </div>
        </div>

        <div className="hidden md:flex gap-16">
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono uppercase tracking-widest text-fuchsia-500">_BUFFER_INT</span>
            <span 
              data-text={currentScore.toString().padStart(4, '0')}
              className="text-6xl font-black tabular-nums font-mono tear-effect tracking-tighter"
            >
              {currentScore.toString().padStart(4, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end bg-fuchsia-500 text-black px-4 py-2 -skew-x-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold">_HIGH_NODE</span>
            <span 
              className="text-6xl font-black tabular-nums font-mono tracking-tighter"
            >
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 grid lg:grid-cols-[1fr,450px] gap-0 max-w-full mx-auto w-full items-stretch">
        {/* Game Area */}
        <section className="flex flex-col items-center justify-center p-10 border-r-2 border-white/10 bg-zinc-950">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="relative p-2 bg-white"
          >
            <SnakeGame onScoreChange={handleScoreChange} />
            
            <div className="absolute top-0 right-full h-full w-10 border-y-2 border-l-2 border-white flex flex-col justify-between p-2">
              {[...Array(10)].map((_, i) => <div key={i} className="w-full h-1 bg-cyan-500" />)}
            </div>
          </motion.div>

          {/* Controls Cryptic */}
          <div className="mt-12 grid grid-cols-4 gap-4">
            {['W', 'A', 'S', 'D'].map((key) => (
              <div key={key} className="w-16 h-16 bg-white flex items-center justify-center text-black font-black text-2xl border-4 border-fuchsia-500 shadow-[4px_4px_0px_#00ffff]">
                {key}
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-cyan-400 opacity-50">INPUT_VECTORS :: MAPPED_0XEF</p>
        </section>

        {/* Sidebar Cryptic */}
        <aside className="bg-black p-0 flex flex-col">
          <div className="p-10 flex-1 space-y-12">
             <div className="relative">
                <div className="absolute -left-10 top-0 bottom-0 w-2 bg-fuchsia-500 animate-pulse" />
                <h2 className="text-xs font-mono uppercase tracking-[0.5em] text-white mb-8 border-b border-white/20 pb-2 flex justify-between">
                  <span>SIGNAL_DECODE</span>
                  <span className="text-cyan-400">01.00.1</span>
                </h2>
                <MusicPlayer />
             </div>

             <div className="bg-zinc-900 border-2 border-white/10 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 bg-white text-black font-mono text-[8px] font-bold">_TELEMETRY</div>
                <h3 className="font-mono text-cyan-400 text-xs mb-6 tracking-widest italic group-hover:tear-effect transition-all" data-text="NODE_HEALTH">NODE_HEALTH</h3>
                <div className="space-y-4">
                   {[
                     { label: "PACKET_LOSS", val: "0.00%", color: "text-white" },
                     { label: "SYNC_STATUS", val: "LOCKED", color: "text-fuchsia-500" },
                     { label: "UPLINK_FRQ", val: "4.2 GHZ", color: "text-white" }
                   ].map((stat, i) => (
                     <div key={i} className="flex justify-between font-mono text-[10px]">
                        <span className="text-zinc-500">{stat.label}</span>
                        <span className={stat.color}>{stat.val}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="h-32 bg-fuchsia-500 p-8 flex items-center justify-between">
             <div className="font-mono text-black leading-tight">
                <p className="text-xs font-black uppercase">CRITICAL_WARNING</p>
                <p className="text-[10px] uppercase opacity-80 italic">Neural interface drift detected. Calibrate immediately.</p>
             </div>
             <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Activity className="w-6 h-6 text-white animate-pulse" />
             </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-white/10 px-10 py-4 bg-black flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">
        <div className="flex gap-10">
          <span className="hover:text-fuchsia-500 cursor-pointer transition-colors">ADDR: 0x88.AF.12</span>
          <span className="text-cyan-400">LATENCY: 0.0003MS</span>
        </div>
        <div className="flex gap-8 items-center font-black">
          <span className="text-white">SYS_OP :: ONLINE</span>
          <span className="bg-white text-black px-2">EMULATOR_MODE</span>
        </div>
      </footer>
    </div>
  );
}

