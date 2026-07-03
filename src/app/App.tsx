import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Search, Anchor, User, MapPin, ChevronRight, CalendarDays, Ship, Navigation } from 'lucide-react';

// Live CSV URLs
const MAIN_DATA_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1RPutA1dobjRDGuFrANYH8VZHBPUBOng22eqUED_sEax2mXvWiwux7y-Oj8QwsAS77hRZtprine8K/pub?gid=1985956288&single=true&output=csv';
const SAILORS_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1RPutA1dobjRDGuFrANYH8VZHBPUBOng22eqUED_sEax2mXvWiwux7y-Oj8QwsAS77hRZtprine8K/pub?gid=128242487&single=true&output=csv';

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // The Magic Bridge: Listens for map popup clicks and opens the Sailor Profile
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'OPEN_SAILOR') {
        navigate(`/sailor/${encodeURIComponent(event.data.name)}`);
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-[#f9f6e7] font-['Adelle_Sans',sans-serif] text-[#1d2758] overflow-hidden">
      
      {/* PREMIUM SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-[#1d2758] text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-8 border-b border-[#465566]">
          <h1 className="text-4xl font-['chapman',sans-serif] font-bold text-[#ead596] leading-tight">
            Delaware<br/>Sailors
          </h1>
          <p className="text-[#bedbd8] text-sm mt-2 font-['Meno_Text',serif] tracking-wider uppercase">Historical Archive</p>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
              location.pathname === '/' ? 'bg-[#cba62a] text-[#1d2758] shadow-md font-bold' : 'hover:bg-[#465566] text-[#bedbd8]'
            }`}
          >
            <MapPin size={22} /> <span className="text-lg">Interactive Map</span>
          </Link>
          <Link 
            to="/search" 
            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
              location.pathname === '/search' ? 'bg-[#cba62a] text-[#1d2758] shadow-md font-bold' : 'hover:bg-[#465566] text-[#bedbd8]'
            }`}
          >
            <Search size={22} /> <span className="text-lg">Advanced Search</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN DYNAMIC CONTENT AREA */}
      <main className="flex-1 relative overflow-y-auto w-full">
        <div className="max-w-[1400px] mx-auto p-10 h-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/sailor/:name" element={<SailorProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// --- HOME / MAP DASHBOARD ---
function Home() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6 shrink-0">
        <h2 className="text-5xl font-['Meno_Text',serif] font-medium text-[#1d2758]">Maritime Routes Timelapse</h2>
        <p className="text-[#465566] mt-3 text-lg max-w-3xl">
          Press play on the timeline to animate historical voyage routes. Pause the simulation and click on any vessel marker to view the list of Delaware crew members on board.
        </p>
      </div>
      
      {/* THE EMBEDDED GOOGLE COLAB HTML MAP */}
      <div className="flex-1 bg-[#ffffff] rounded-2xl shadow-sm border-2 border-[#ead596] overflow-hidden relative">
        <iframe 
          src="/delaware_sailors_map.html" 
          title="Interactive Ship Map"
          className="w-full h-full border-0 absolute inset-0 bg-[#000000]"
        />
      </div>
    </div>
  );
}

// --- ADVANCED SEARCH ENGINE ---
function AdvancedSearch() {
  const [sailors, setSailors] = useState<any[]>([]);
  const [voyages, setVoyages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search Form State
  const [sailorQuery, setSailorQuery] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [vesselQuery, setVesselQuery] = useState('');
  const [rigQuery, setRigQuery] = useState('');
  const [arrivalPort, setArrivalPort] = useState('');
  
  // Results State
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch both live Google Sheets on load
  useEffect(() => {
    let sData = [], vData = [];
    Papa.parse(SAILORS_CSV, {
      download: true, header: true, complete: (r) => {
        sData = r.data;
        if (vData.length) { setSailors(sData); setVoyages(vData); setLoading(false); }
      }
    });
    Papa.parse(MAIN_DATA_CSV, {
      download: true, header: true, complete: (r) => {
        vData = r.data;
        if (sData.length) { setSailors(sData); setVoyages(vData); setLoading(false); }
      }
    });
  }, []);

  const handleSearch = () => {
    setHasSearched(true);
    const filtered = sailors.filter(s => {
      if (!s.Name) return false;
      
      const matchName = sailorQuery === '' || s.Name.toLowerCase().includes(sailorQuery.toLowerCase());
      const matchDOB = birthYear === '' || (s.DOB && String(s.DOB).includes(birthYear));
      
      let matchVoyage = true;
      if (vesselQuery !== '' || rigQuery !== '' || arrivalPort !== '') {
          const vIds = [];
          for (let i = 1; i <= 19; i++) {
            if (s[`Voy_Ser_${i}`]) vIds.push(s[`Voy_Ser_${i}`].trim());
          }
          const matchingVoyages = voyages.filter(v => vIds.includes(String(v.voyageid)));
          const hasMatchingVoyage = matchingVoyages.some(v => {
             const mName = vesselQuery === '' || (v.shipname && v.shipname.toLowerCase().includes(vesselQuery.toLowerCase()));
             const mRig = rigQuery === '' || (v.rig && v.rig.toLowerCase() === rigQuery.toLowerCase());
             const mPort = arrivalPort === '' || (v.portret && v.portret.toLowerCase().includes(arrivalPort.toLowerCase()));
             return mName && mRig && mPort;
          });
          matchVoyage = hasMatchingVoyage;
      }
      return matchName && matchDOB && matchVoyage;
    });
    setResults(filtered);
  };

  if (loading) return <div className="text-xl font-bold text-[#cba62a] p-10 animate-pulse">Synchronizing Archival Datasets...</div>;

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-5xl font-['Meno_Text',serif] text-[#1d2758]">Database Search</h2>
        <p className="text-[#465566] mt-2 text-lg">Filter historical records spanning cross-referenced maritime and crew datasets.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#ffffff] p-8 rounded-2xl shadow-sm border border-[#ead596]">
        
        {/* MARINER INFORMATION */}
        <div className="space-y-5">
          <h3 className="text-2xl font-bold text-[#833337] border-b-2 border-[#ead596] pb-2 flex items-center gap-2">
            <User size={24} /> Mariner Information
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1d2758] uppercase tracking-wider">Sailor Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-[#465566]" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-[#f3f3f5] rounded-xl border border-[#bedbd8] focus:border-[#1d2758] focus:ring-2 focus:ring-[#1d2758]/20 outline-none transition-all" 
                placeholder="e.g. John Smith"
                value={sailorQuery}
                onChange={(e) => setSailorQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1d2758] uppercase tracking-wider">Birth Year Range</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3.5 text-[#465566]" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-[#f3f3f5] rounded-xl border border-[#bedbd8] focus:border-[#1d2758] focus:ring-2 focus:ring-[#1d2758]/20 outline-none transition-all" 
                placeholder="e.g. 1780"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* VESSEL INFORMATION */}
        <div className="space-y-5">
          <h3 className="text-2xl font-bold text-[#833337] border-b-2 border-[#ead596] pb-2 flex items-center gap-2">
            <Ship size={24} /> Vessel Information
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1d2758] uppercase tracking-wider">Vessel Name</label>
            <div className="relative">
              <Anchor className="absolute left-3 top-3.5 text-[#465566]" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-[#f3f3f5] rounded-xl border border-[#bedbd8] focus:border-[#1d2758] focus:ring-2 focus:ring-[#1d2758]/20 outline-none transition-all" 
                placeholder="e.g. Aurora"
                value={vesselQuery}
                onChange={(e) => setVesselQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1d2758] uppercase tracking-wider">Rig Type</label>
              <select 
                className="w-full p-3 bg-[#f3f3f5] rounded-xl border border-[#bedbd8] focus:border-[#1d2758] focus:ring-2 focus:ring-[#1d2758]/20 outline-none transition-all appearance-none cursor-pointer"
                value={rigQuery}
                onChange={(e) => setRigQuery(e.target.value)}
              >
                <option value="">All Rigs</option>
                <option value="Ship">Ship</option>
                <option value="Brig">Brig</option>
                <option value="Schooner">Schooner</option>
                <option value="Sloop">Sloop</option>
                <option value="Snow">Snow</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1d2758] uppercase tracking-wider">Arrival Port</label>
              <div className="relative">
                <Navigation className="absolute left-3 top-3.5 text-[#465566]" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-[#f3f3f5] rounded-xl border border-[#bedbd8] focus:border-[#1d2758] focus:ring-2 focus:ring-[#1d2758]/20 outline-none transition-all" 
                  placeholder="e.g. Havana"
                  value={arrivalPort}
                  onChange={(e) => setArrivalPort(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 pt-4">
          <button 
            onClick={handleSearch}
            className="w-full bg-[#cba62a] text-[#1d2758] text-lg font-bold py-4 rounded-xl shadow-md hover:bg-[#b08f22] hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search size={22} /> Execute Query
          </button>
        </div>
      </div>

      {/* DYNAMIC SEARCH RESULTS */}
      {hasSearched && (
        <div className="pt-6 border-t-2 border-[#ead596] animate-in fade-in duration-500">
          <h3 className="text-3xl font-['Meno_Text',serif] text-[#1d2758] mb-6">Archive Results ({results.length})</h3>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {results.map((r, i) => (
                <Link to={`/sailor/${encodeURIComponent(r.Name)}`} key={i} className="block group">
                  <div className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border-2 border-[#ead596] group-hover:border-[#1d2758] group-hover:shadow-md transition-all duration-300">
                    <h4 className="text-2xl font-bold text-[#1d2758] flex items-center justify-between mb-2">
                      {r.Name}
                      <ChevronRight className="text-[#cba62a] group-hover:translate-x-2 transition-transform duration-300" size={28} />
                    </h4>
                    <div className="flex gap-4 text-sm text-[#465566]">
                      <span className="flex items-center gap-1 bg-[#f3f3f5] px-3 py-1 rounded-md"><CalendarDays size={14}/> Born: {r.DOB || 'Unknown'}</span>
                      <span className="flex items-center gap-1 bg-[#f3f3f5] px-3 py-1 rounded-md"><MapPin size={14}/> {r.Hometown || 'Unknown Hometown'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#ffffff] p-12 rounded-2xl shadow-sm border-2 border-[#ead596] text-center">
              <User size={64} className="mx-auto text-[#bedbd8] mb-4" />
              <p className="text-[#465566] text-xl">No historical records found matching your criteria.</p>
              <button onClick={() => setHasSearched(false)} className="text-[#cba62a] hover:text-[#1d2758] mt-4 font-bold transition-colors">Clear Filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- SAILOR PROFILE & TIMELINE ---
function SailorProfile() {
  const { name } = useParams();
  const [sailorData, setSailorData] = useState<any>(null);
  const [voyageList, setVoyageList] = useState<any[]>([]);

  useEffect(() => {
    Papa.parse(SAILORS_CSV, {
      download: true,
      header: true,
      complete: (results) => {
        const found = results.data.find((row: any) => row.Name === name);
        if (found) {
          setSailorData(found);
          const vIds = [];
          for (let i = 1; i <= 19; i++) {
            const vid = found[`Voy_Ser_${i}`];
            if (vid && vid.trim() !== '') vIds.push(vid.trim());
          }

          if (vIds.length > 0) {
            Papa.parse(MAIN_DATA_CSV, {
              download: true,
              header: true,
              complete: (voyageResults) => {
                const matchedVoyages = voyageResults.data.filter((v: any) => vIds.includes(String(v.voyageid)));
                setVoyageList(matchedVoyages);
              }
            });
          }
        }
      }
    });
  }, [name]);

  if (!sailorData) return <div className="text-2xl text-[#cba62a] font-bold p-10 animate-pulse">Accessing Archive for {name}...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in slide-in-from-right-8 fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="border-b-4 border-[#cba62a] pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-['chapman',sans-serif] text-[#1d2758] uppercase tracking-wide">{sailorData.Name}</h2>
          <h3 className="text-3xl font-['Meno_Text',serif] text-[#465566] mt-3 flex items-center gap-2">
            <MapPin className="text-[#833337]" size={28}/> {sailorData.Hometown || 'Unknown Origin'}
          </h3>
        </div>
        <Link to="/search" className="text-[#465566] hover:text-[#1d2758] font-bold mb-2 transition-colors flex items-center gap-1">
          &larr; Back to Search
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: PHYSICAL DESCRIPTION CARD */}
        <div className="bg-[#ffffff] p-8 rounded-2xl shadow-sm border border-[#ead596] h-fit sticky top-10">
          <h4 className="text-2xl font-bold text-[#833337] mb-6 flex items-center gap-2">
            <User size={24} /> Physical Ledger
          </h4>
          <ul className="space-y-4 text-lg">
            <li className="flex justify-between items-center border-b border-[#f3f3f5] pb-3">
              <span className="font-bold text-[#1d2758]">Birth Year:</span> 
              <span className="bg-[#f9f6e7] px-3 py-1 rounded text-[#465566]">{sailorData.DOB || 'N/A'}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#f3f3f5] pb-3">
              <span className="font-bold text-[#1d2758]">Complexion:</span> 
              <span className="text-[#465566]">{sailorData.Comp || 'N/A'}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#f3f3f5] pb-3">
              <span className="font-bold text-[#1d2758]">Height:</span> 
              <span className="text-[#465566]">{sailorData.Height || 'N/A'}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#f3f3f5] pb-3">
              <span className="font-bold text-[#1d2758]">Hair Color:</span> 
              <span className="text-[#465566]">{sailorData.Hair_Color || 'N/A'}</span>
            </li>
            <li className="flex flex-col pt-2">
              <span className="font-bold text-[#1d2758] mb-2">Identifying Markings:</span> 
              <span className="text-[#465566] italic bg-[#f3f3f5] p-3 rounded-lg border border-[#bedbd8]">"{sailorData.Markings || 'None recorded'}"</span>
            </li>
          </ul>
        </div>

        {/* RIGHT COLUMN: VOYAGE HISTORY TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-4xl font-['Meno_Text',serif] text-[#1d2758] mb-8">Voyage History</h4>
          
          <div className="pl-4 border-l-4 border-[#bedbd8] space-y-8 relative">
            {voyageList.length > 0 ? (
              voyageList.map((voyage, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[27px] top-4 w-6 h-6 bg-[#cba62a] rounded-full border-4 border-[#f9f6e7] group-hover:bg-[#1d2758] group-hover:scale-125 transition-all duration-300"></div>
                  
                  {/* Voyage Card */}
                  <div className="ml-6 bg-[#ffffff] p-6 rounded-2xl shadow-sm border-2 border-[#ead596] group-hover:border-[#1d2758] group-hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-2xl font-bold text-[#1d2758] flex items-center gap-3">
                          {voyage.shipname} 
                          <span className="text-sm font-normal bg-[#bedbd8] text-[#1d2758] px-3 py-1 rounded-full uppercase tracking-wider">{voyage.rig}</span>
                        </h5>
                        <p className="text-[#465566] mt-1 font-medium">Captain: {voyage.Captain || 'Unknown'}</p>
                      </div>
                      <div className="bg-[#f3f3f5] px-4 py-2 rounded-xl border border-[#bedbd8] text-center">
                        <p className="text-xs font-bold text-[#833337] uppercase">Departure</p>
                        <p className="text-lg font-bold text-[#1d2758]">{voyage.Date_dep.split('T')[0]}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#f9f6e7] p-4 rounded-xl flex items-center gap-4 text-[#1d2758] font-bold border border-[#ead596]">
                      <span>Philadelphia</span>
                      <div className="flex-1 border-b-2 border-dashed border-[#cba62a] relative">
                        <Anchor className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#cba62a]" size={16} />
                      </div>
                      <span>{voyage.portret}</span>
                    </div>
                    <p className="text-right text-xs text-[#465566] mt-3">Archival ID: {voyage.voyageid}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="ml-6 bg-[#ffffff] p-8 rounded-2xl border-2 border-dashed border-[#bedbd8] text-[#465566]">
                No specific voyage records could be cross-referenced for this mariner in the current database index.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}