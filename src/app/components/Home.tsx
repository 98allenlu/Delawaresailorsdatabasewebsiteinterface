import React, { useState } from 'react';
import { Search, X, Play, Pause } from 'lucide-react';
import { Link } from 'react-router';
import { LewesMuseumLogo } from './LewesMuseumLogo';

export function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  return (
    <div className="flex h-full w-full bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-[30%] min-w-[320px] max-w-sm border-r border-border bg-card flex flex-col z-10 relative">
        <div className="p-6 border-b border-border bg-secondary/10">
          <p className="font-[family:var(--font-body)] text-muted-foreground text-sm uppercase tracking-widest">Interactive Map</p>
          <h2 className="font-[family:var(--font-serif)] text-primary text-2xl mt-1">Voyages & Routes</h2>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">
          {/* Filters */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
               <label className="font-[family:var(--font-serif)] text-sm text-foreground font-medium">Port of Departure</label>
               <select className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                 <option>All Ports</option>
                 <option>Philadelphia</option>
                 <option>Wilmington</option>
                 <option>New Castle</option>
               </select>
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-[family:var(--font-serif)] text-sm text-foreground font-medium">Port of Arrival</label>
               <select className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                 <option>All Ports</option>
                 <option>London</option>
                 <option>Barbados</option>
                 <option>Jamaica</option>
                 <option>Bordeaux</option>
               </select>
            </div>
            <div className="flex flex-col gap-2">
               <label className="font-[family:var(--font-serif)] text-sm text-foreground font-medium">Vessel Flag</label>
               <select className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                 <option>All Flags</option>
                 <option>United States</option>
                 <option>Great Britain</option>
                 <option>France</option>
                 <option>Spain</option>
               </select>
            </div>
          </div>

          {/* Year Range Slider */}
          <div className="flex flex-col gap-2 mt-4 border-t border-border pt-6">
            <label className="font-[family:var(--font-serif)] text-sm text-foreground font-medium flex justify-between">
              <span>Year Range</span>
              <span className="text-muted-foreground font-[family:var(--font-body)]">1750 - 1800</span>
            </label>
            <div className="pt-6 pb-2 px-2">
              <div className="relative h-1.5 bg-border rounded-full w-full">
                <div className="absolute left-[20%] right-[30%] h-full bg-primary rounded-full"></div>
                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-card border-2 border-primary rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
                <div className="absolute right-[30%] top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-card border-2 border-primary rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1 font-[family:var(--font-body)]">
              <span>1700</span>
              <span>1850</span>
            </div>
          </div>

          {/* Museum Logo */}
          <div className="mt-auto pt-6 border-t border-border">
            <LewesMuseumLogo className="w-full max-w-[180px] h-auto opacity-75" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-secondary/5 flex flex-col border-l border-border">
        {/* Massive Central Map Container */}
        <div className="flex-1 w-full h-full flex items-center justify-center relative">
           <div className="absolute inset-0 flex items-center justify-center p-8 bg-background">
              <h2 className="font-[family:var(--font-serif)] text-primary text-3xl md:text-5xl text-center max-w-2xl leading-relaxed tracking-widest opacity-30 select-none">
                MAKE SPACE FOR INTERACTIVE MAP EMBED HERE
              </h2>
           </div>

           {/* Floating Voyage Details Card */}
           {isDetailsVisible && (
             <div className="absolute top-6 right-6 w-[28rem] bg-card border border-border shadow-2xl z-20 animate-in fade-in slide-in-from-right-8 duration-500 rounded-sm">
               <div className="p-4 border-b border-border bg-secondary/10 flex justify-between items-start">
                 <div>
                   <h3 className="font-[family:var(--font-serif)] text-xl text-primary font-bold">The Fair American</h3>
                   <p className="font-[family:var(--font-body)] text-xs text-muted-foreground mt-1 uppercase tracking-wider">Capt. Stephen Decatur Sr. • 1780</p>
                 </div>
                 <button 
                   onClick={() => setIsDetailsVisible(false)}
                   className="p-1 hover:bg-muted rounded-sm text-muted-foreground transition-colors"
                   aria-label="Close details"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="p-0 max-h-[60vh] overflow-y-auto">
                 <table className="w-full text-left border-collapse font-[family:var(--font-body)] text-sm">
                   <thead className="sticky top-0 bg-card z-10 border-b border-border">
                     <tr>
                       <th className="py-2 px-4 font-semibold text-muted-foreground font-[family:var(--font-serif)] text-xs uppercase tracking-wider">Crew Name</th>
                       <th className="py-2 px-4 font-semibold text-muted-foreground font-[family:var(--font-serif)] text-xs uppercase tracking-wider">Role</th>
                       <th className="py-2 px-4 font-semibold text-muted-foreground font-[family:var(--font-serif)] text-xs uppercase tracking-wider">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/50">
                     <tr className="hover:bg-muted/30 transition-colors group">
                       <td className="py-3 px-4 font-medium text-foreground">
                         <Link to="/sailor/1" className="text-primary hover:text-secondary underline underline-offset-2 decoration-primary/30">James Forten</Link>
                       </td>
                       <td className="py-3 px-4 text-muted-foreground">Powder Boy</td>
                       <td className="py-3 px-4">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20 uppercase tracking-wider">
                           Captured
                         </span>
                       </td>
                     </tr>
                     <tr className="hover:bg-muted/30 transition-colors group">
                       <td className="py-3 px-4 font-medium text-foreground">
                         <Link to="/sailor/2" className="text-primary hover:text-secondary underline underline-offset-2 decoration-primary/30">William Smith</Link>
                       </td>
                       <td className="py-3 px-4 text-muted-foreground">Able Seaman</td>
                       <td className="py-3 px-4">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                           Active
                         </span>
                       </td>
                     </tr>
                     <tr className="hover:bg-muted/30 transition-colors group">
                       <td className="py-3 px-4 font-medium text-foreground">
                         <Link to="/sailor/3" className="text-primary hover:text-secondary underline underline-offset-2 decoration-primary/30">Thomas Jones</Link>
                       </td>
                       <td className="py-3 px-4 text-muted-foreground">Mate</td>
                       <td className="py-3 px-4">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                           Active
                         </span>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </div>
           )}
        </div>

        {/* Bottom Timeline Control */}
        <div className="h-28 bg-card border-t border-border flex items-center px-8 gap-8 z-20 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.1)] relative">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12 rounded-full border border-primary bg-background text-primary flex items-center justify-center hover:bg-primary hover:text-background active:scale-95 transition-all shadow-sm shrink-0"
            aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-end font-[family:var(--font-body)] text-xs text-muted-foreground font-medium uppercase tracking-widest">
              <span>1750</span>
              <div className="flex flex-col items-center">
                <span className="text-primary font-bold text-lg font-[family:var(--font-serif)] mb-1">1780</span>
                <div className="h-2 w-px bg-primary"></div>
              </div>
              <span>1800</span>
            </div>
            <div className="relative h-1 w-full bg-border rounded-full cursor-pointer overflow-visible">
              <div className="absolute left-0 top-0 h-full w-[60%] bg-primary rounded-full"></div>
              <div className="absolute left-[60%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-card border-[3px] border-primary rounded-full cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-sm"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}