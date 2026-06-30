import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowRight, Filter, X, Anchor, User } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { sailors, type Sailor } from '../data/sailors';

export function AdvancedSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Local state for form inputs
  const [form, setForm] = useState({
    name: searchParams.get('name') || '',
    yob: searchParams.get('yob') || '',
    complexion: searchParams.get('complexion') || '',
    vessel: searchParams.get('vessel') || '',
    rig: searchParams.get('rig') || '',
    portBegan: searchParams.get('portBegan') || '',
    portEnded: searchParams.get('portEnded') || '',
  });

  // Sync local state when searchParams changes
  useEffect(() => {
    setForm({
      name: searchParams.get('name') || '',
      yob: searchParams.get('yob') || '',
      complexion: searchParams.get('complexion') || '',
      vessel: searchParams.get('vessel') || '',
      rig: searchParams.get('rig') || '',
      portBegan: searchParams.get('portBegan') || '',
      portEnded: searchParams.get('portEnded') || '',
    });
  }, [searchParams]);

  // Derived results
  const results = useMemo(() => {
    const nameParam = searchParams.get('name');
    const yobParam = searchParams.get('yob');
    const complexionParam = searchParams.get('complexion');
    const vesselParam = searchParams.get('vessel');
    const rigParam = searchParams.get('rig');
    const portBeganParam = searchParams.get('portBegan');
    const portEndedParam = searchParams.get('portEnded');

    if (!nameParam && !yobParam && !complexionParam && !vesselParam && !rigParam && !portBeganParam && !portEndedParam) {
      return null;
    }

    return sailors.filter(s => {
      if (nameParam && !s.name.toLowerCase().includes(nameParam.toLowerCase())) return false;
      if (yobParam && s.yearOfBirth !== yobParam) return false;
      if (complexionParam && s.description.complexion.toLowerCase() !== complexionParam.toLowerCase()) return false;

      if (vesselParam || rigParam || portBeganParam || portEndedParam) {
        const hasMatchingVoyage = s.voyages.some(v => {
          if (vesselParam && !v.vessel.toLowerCase().includes(vesselParam.toLowerCase())) return false;
          if (rigParam && v.rig.toLowerCase() !== rigParam.toLowerCase()) return false;
          if (portBeganParam && !v.portBegan.toLowerCase().includes(portBeganParam.toLowerCase())) return false;
          if (portEndedParam && !v.portEnded.toLowerCase().includes(portEndedParam.toLowerCase())) return false;
          return true;
        });
        if (!hasMatchingVoyage) return false;
      }

      return true;
    });
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params: Record<string, string> = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
    setIsSidebarOpen(false);
  };

  const clearFilters = () => {
    setForm({
      name: '',
      yob: '',
      complexion: '',
      vessel: '',
      rig: '',
      portBegan: '',
      portEnded: '',
    });
    setSearchParams({});
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Filters */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-80 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col h-full
      `}>
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/5">
          <h2 className="font-[family:var(--font-serif)] text-xl text-primary flex items-center gap-2" style={{ fontWeight: 700 }}>
            <Filter className="w-5 h-5" /> Filter Records
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar" onSubmit={handleSearch}>
          {/* Section: Mariner */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <User className="w-4 h-4 text-secondary" />
              <h3 className="font-[family:var(--font-body)] text-xs uppercase tracking-widest text-muted-foreground font-bold">Mariner Information</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Name</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => updateField('name', e.target.value)} 
                  className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" 
                  placeholder="e.g. Peter Johnson" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Birth Year</label>
                  <input 
                    type="number" 
                    value={form.yob} 
                    onChange={e => updateField('yob', e.target.value)} 
                    className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" 
                    placeholder="1788" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Complexion</label>
                  <select 
                    value={form.complexion} 
                    onChange={e => updateField('complexion', e.target.value)} 
                    className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="mulatto">Mulatto</option>
                    <option value="ruddy">Ruddy</option>
                    <option value="native">Native</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Voyage */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <Anchor className="w-4 h-4 text-secondary" />
              <h3 className="font-[family:var(--font-body)] text-xs uppercase tracking-widest text-muted-foreground font-bold">Vessel & Voyage</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Vessel Name</label>
                <input 
                  type="text" 
                  value={form.vessel} 
                  onChange={e => updateField('vessel', e.target.value)} 
                  className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" 
                  placeholder="e.g. Ship Jane" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Rig</label>
                <select 
                  value={form.rig} 
                  onChange={e => updateField('rig', e.target.value)} 
                  className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="">Any Rig</option>
                  <option value="ship">Ship</option>
                  <option value="brig">Brig</option>
                  <option value="schooner">Schooner</option>
                  <option value="sloop">Sloop</option>
                  <option value="privateer">Privateer</option>
                </select>
              </div>



              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Arrival Port</label>
                <input 
                  type="text" 
                  value={form.portEnded} 
                  onChange={e => updateField('portEnded', e.target.value)} 
                  className="w-full p-2 bg-input-background border border-border rounded-sm font-[family:var(--font-body)] text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground" 
                  placeholder="e.g. Liverpool" 
                />
              </div>
            </div>
          </section>
        </form>

        <div className="p-6 border-t border-border bg-muted/20 flex flex-col gap-3">
          <button 
            onClick={() => handleSearch()} 
            className="w-full py-2.5 bg-primary text-background font-[family:var(--font-serif)] rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
            style={{ fontWeight: 500 }}
          >
            <Search className="w-4 h-4" /> Apply Filters
          </button>
          <button 
            onClick={clearFilters} 
            className="w-full py-2 text-primary font-[family:var(--font-body)] text-xs uppercase tracking-widest hover:underline transition-all"
            style={{ fontWeight: 700 }}
          >
            Reset All
          </button>
        </div>
      </aside>

      {/* Main Results Area */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-border bg-card flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-primary font-[family:var(--font-body)] text-xs uppercase tracking-widest font-bold"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <span className="font-[family:var(--font-serif)] text-muted-foreground italic text-sm">
            {results ? `${results.length} found` : 'Searching...'}
          </span>
        </div>

        <div className="p-8 md:p-12 max-w-6xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-10 pb-6 border-b border-border/60">
            <h1 className="font-[family:var(--font-display)] text-primary text-4xl md:text-5xl mb-2 tracking-wide" style={{ fontWeight: 700 }}>
              Advanced Search
            </h1>
            <p className="font-[family:var(--font-serif)] text-muted-foreground text-lg italic">
              Explore the historical records of the Delaware maritime community.
            </p>
          </div>

          {/* Results List */}
          <div className="flex flex-col gap-6">
            {results === null ? (
              <div className="bg-card border border-border border-dashed p-16 text-center flex flex-col items-center gap-4">
                <Search className="w-12 h-12 text-muted/30" />
                <div className="flex flex-col gap-1">
                  <p className="font-[family:var(--font-serif)] text-muted-foreground text-xl italic">Ready to search the database.</p>
                  <p className="font-[family:var(--font-body)] text-sm text-muted-foreground/70">Use the filters on the left to find records.</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-card border border-border p-16 text-center shadow-sm">
                <p className="font-[family:var(--font-serif)] text-muted-foreground text-xl italic mb-2">No matches found for your criteria.</p>
                <button 
                  onClick={clearFilters}
                  className="text-primary hover:text-secondary font-[family:var(--font-body)] text-xs uppercase tracking-widest font-bold underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="font-[family:var(--font-body)] text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                    Showing {results.length} record{results.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex flex-col gap-px bg-border border border-border overflow-hidden">
                  {results.map(sailor => (
                    <Link
                      key={sailor.id}
                      to={`/sailor/${sailor.id}`}
                      className="group bg-card hover:bg-secondary/5 transition-colors p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-4">
                          <span className="font-[family:var(--font-display)] text-primary text-2xl group-hover:text-secondary transition-colors" style={{ fontWeight: 700 }}>
                            {sailor.name}
                          </span>
                          <span className="font-[family:var(--font-serif)] text-muted-foreground italic text-sm">
                            born {sailor.yearOfBirth}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-[family:var(--font-body)] text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 capitalize">
                            <span className="w-2 h-2 rounded-full bg-secondary/40" />
                            {sailor.description.complexion} complexion
                          </span>
                          <span className="w-px h-3 bg-border hidden md:inline-block"></span>
                          <span>{sailor.description.height}</span>
                          <span className="w-px h-3 bg-border hidden md:inline-block"></span>
                          <span>{sailor.description.hairColor} hair</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
                        <div className="flex flex-col items-end">
                          <span className="font-[family:var(--font-serif)] text-lg text-primary" style={{ fontWeight: 700 }}>
                            {sailor.voyages.length}
                          </span>
                          <span className="font-[family:var(--font-body)] text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                            Voyages
                          </span>
                        </div>
                        <div className="h-10 w-px bg-border hidden md:block" />
                        <div className="flex items-center gap-2 font-[family:var(--font-body)] text-[10px] text-primary uppercase tracking-widest font-bold group-hover:gap-3 transition-all">
                          View Record <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--brand-gold-light, #ead596);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--brand-gold, #cba62a);
        }
      `}} />
    </div>
  );
}
