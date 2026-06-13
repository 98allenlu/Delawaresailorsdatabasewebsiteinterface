import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { sailors, type Sailor } from '../data/sailors';

export function AdvancedSearch() {
  const [sailorName, setSailorName]       = useState('');
  const [yearOfBirth, setYearOfBirth]     = useState('');
  const [complexion, setComplexion]       = useState('');
  const [vesselName, setVesselName]       = useState('');
  const [rig, setRig]                     = useState('');
  const [portBegan, setPortBegan]         = useState('');
  const [portEnded, setPortEnded]         = useState('');
  const [results, setResults]             = useState<Sailor[] | null>(null);

  function handleSearch() {
    const filtered = sailors.filter(s => {
      if (sailorName && !s.name.toLowerCase().includes(sailorName.toLowerCase())) return false;
      if (yearOfBirth && s.yearOfBirth !== yearOfBirth) return false;
      if (complexion && !s.description.complexion.toLowerCase().includes(complexion.toLowerCase())) return false;
      if (vesselName && !s.voyages.some(v => v.vessel.toLowerCase().includes(vesselName.toLowerCase()))) return false;
      return true;
    });
    setResults(filtered);
  }

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-background p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 border-b border-border/50 pb-8">
          <h1 className="font-[family:var(--font-display)] text-primary text-4xl mb-3 tracking-wide" style={{ fontWeight: 700 }}>Advanced Search</h1>
          <p className="font-[family:var(--font-serif)] text-muted-foreground text-lg italic">Consult the records of voyages, vessels, and mariners.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Voyage / Ship Variables */}
          <div className="bg-card p-8 border border-border shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <h2 className="font-[family:var(--font-serif)] text-2xl text-foreground mb-6 tracking-wide border-b border-border pb-2" style={{ fontWeight: 700 }}>Vessel & Voyage Details</h2>

            <form className="flex flex-col gap-5 font-[family:var(--font-body)]" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Vessel Name</label>
                <input type="text" value={vesselName} onChange={e => setVesselName(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground" placeholder="e.g. Ship Jane" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Rig</label>
                <select value={rig} onChange={e => setRig(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                  <option value="">Select Rig Type</option>
                  <option value="ship">Ship</option>
                  <option value="brig">Brig</option>
                  <option value="schooner">Schooner</option>
                  <option value="sloop">Sloop</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Began (Port)</label>
                  <input type="text" value={portBegan} onChange={e => setPortBegan(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" placeholder="e.g. Philadelphia" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Ended (Port)</label>
                  <input type="text" value={portEnded} onChange={e => setPortEnded(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" placeholder="e.g. London" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Date Began</label>
                  <input type="date" className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Date Completed</label>
                  <input type="date" className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Voyage Length</label>
                <div className="flex items-center gap-2">
                  <input type="number" className="w-24 p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" placeholder="e.g. 6" />
                  <span className="text-sm text-muted-foreground italic">months</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-2">
                <button type="submit" className="w-full px-8 py-3 bg-primary text-background font-[family:var(--font-serif)] text-lg rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm border border-transparent" style={{ fontWeight: 500 }}>
                  <Search className="w-5 h-5" />
                  Search Records
                </button>
              </div>
            </form>
          </div>

          {/* Sailor Variables */}
          <div className="bg-card p-8 border border-border shadow-sm relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
            <h2 className="font-[family:var(--font-serif)] text-2xl text-foreground mb-6 tracking-wide border-b border-border pb-2" style={{ fontWeight: 700 }}>Mariner Information</h2>

            <form className="flex flex-col gap-5 font-[family:var(--font-body)]" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Sailor Name</label>
                <input type="text" value={sailorName} onChange={e => setSailorName(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground" placeholder="e.g. Peter Johnson" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Year of Birth</label>
                  <input type="number" value={yearOfBirth} onChange={e => setYearOfBirth(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" placeholder="e.g. 1788" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 700 }}>Race / Complexion</label>
                  <select value={complexion} onChange={e => setComplexion(e.target.value)} className="w-full p-2.5 bg-input-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground">
                    <option value="">Any</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="mulatto">Mulatto</option>
                    <option value="ruddy">Ruddy</option>
                    <option value="native">Native American</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        {results !== null && (
          <div className="mt-12">
            <div className="border-b border-border pb-4 mb-6 flex items-baseline justify-between">
              <h2 className="font-[family:var(--font-serif)] text-2xl text-foreground" style={{ fontWeight: 700 }}>
                Search Results
              </h2>
              <span className="font-[family:var(--font-body)] text-sm text-muted-foreground">
                {results.length} record{results.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-card border border-border p-12 text-center">
                <p className="font-[family:var(--font-serif)] text-muted-foreground text-xl italic">No records match your search.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-0 border border-border divide-y divide-border">
                {results.map(sailor => (
                  <Link
                    key={sailor.id}
                    to={`/sailor/${sailor.id}`}
                    className="group bg-card hover:bg-secondary/5 transition-colors p-6 flex items-center justify-between gap-6"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-[family:var(--font-display)] text-primary text-2xl group-hover:text-secondary transition-colors" style={{ fontWeight: 700 }}>
                        {sailor.name}
                      </span>
                      <div className="flex items-center gap-4 font-[family:var(--font-body)] text-sm text-muted-foreground">
                        <span>b. {sailor.yearOfBirth}</span>
                        <span className="w-px h-3 bg-border inline-block"></span>
                        <span>{sailor.description.complexion} complexion, {sailor.description.hairColor.toLowerCase()} hair</span>
                        <span className="w-px h-3 bg-border inline-block"></span>
                        <span>{sailor.description.height}</span>
                        <span className="w-px h-3 bg-border inline-block"></span>
                        <span>{sailor.voyages.length} voyage{sailor.voyages.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-[family:var(--font-body)] text-xs text-primary uppercase tracking-widest shrink-0 group-hover:gap-3 transition-all" style={{ fontWeight: 700 }}>
                      View Record <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
