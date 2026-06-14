import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, navigate] = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle fade-up animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/koberce?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setShowAutocomplete(false);
    setSearchValue('');
  };

  const autocompleteItems = [
    { label: 'Červené koberce', path: '/koberce/cervene', tag: 'Barva' },
    { label: 'Vlněné koberce', path: '/koberce/vlnene', tag: 'Materiál' },
    { label: 'Koberce 200×300 cm', path: '/koberce/cervene/vlnene/200x300', tag: 'Rozměr' },
    { label: 'Shaggy koberce (dlouhý vlas)', path: '/koberce/shaggy', tag: 'Typ' },
    { label: 'Modré koberce', path: '/koberce/modre', tag: 'Barva' },
  ];

  const categories = [
    { name: 'Červené koberce', path: '/koberce/cervene', desc: 'Orientální, moderní i boho', color: 'cat-cervene', featured: true },
    { name: 'Modré koberce', path: '/koberce/modre', desc: 'Námořní a pastelové odstíny', color: 'cat-modre' },
    { name: 'Vlněné koberce', path: '/koberce/vlnene', desc: 'Přírodní materiál, luxusní pocit', color: 'cat-vlnene' },
    { name: 'Šedé koberce', path: '/koberce/sedy', desc: 'Nadčasové, do každého interiéru', color: 'cat-sedy' },
    { name: 'Zelené koberce', path: '/koberce/zelene', desc: 'Svěžest přírody dovnitř', color: 'cat-zelene' },
    { name: 'Shaggy koberce', path: '/koberce/shaggy', desc: 'Dlouhý vlas, měkký dotek', color: 'cat-shaggy' },
  ];

  const filterPills = [
    { label: '🔴 Červené', path: '/koberce/cervene' },
    { label: '🔵 Modré', path: '/koberce/modre' },
    { label: '⚫ Šedé', path: '/koberce/sedy' },
    { label: '🟢 Zelené', path: '/koberce/zelene' },
    { label: '🟡 Béžové', path: '/koberce/bezove' },
    { label: 'Vlněné', path: '/koberce/vlnene' },
    { label: 'Polypropylen', path: '/koberce/polypropylen' },
    { label: 'Shaggy', path: '/koberce/shaggy' },
    { label: 'Orientální', path: '/koberce/orientalni' },
    { label: '200×300 cm', path: '/koberce/cervene/vlnene/200x300' },
    { label: '160×230 cm', path: '/koberce/modre/vlnene/160x230' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <style>{`
        :root {
          --green-deep:   #1A3329;
          --green-mid:    #2C5041;
          --green-light:  #3D6B57;
          --sand:         #D4B896;
          --sand-light:   #EDE0CF;
          --cream:        #F7F4EF;
          --terracotta:   #C4724A;
          --text-dark:    #1A1A18;
          --text-mid:     #4A4A46;
          --text-light:   #8A8A84;
          --white:        #FFFFFF;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 0.8; transform: scaleY(1); }
        }

        .scroll-hint-line {
          animation: scrollPulse 2s ease-in-out infinite;
        }

        .cat-cervene { background: linear-gradient(135deg, #8B1A1A 0%, #C4724A 50%, #E8A090 100%); }
        .cat-modre { background: linear-gradient(135deg, #1A3A6B 0%, #2E6DA4 50%, #7AB3D4 100%); }
        .cat-vlnene { background: linear-gradient(135deg, #5C4A30 0%, #9E7F55 50%, #D4B896 100%); }
        .cat-sedy { background: linear-gradient(135deg, #2A2A2A 0%, #5A5A5A 50%, #A0A0A0 100%); }
        .cat-zelene { background: linear-gradient(135deg, #1A3329 0%, #2C5041 50%, #6A9E7F 100%); }
        .cat-shaggy { background: linear-gradient(135deg, #3D2B1F 0%, #7A5C45 50%, #C4A882 100%); }
      `}</style>

      {/* NAV */}
      <nav
        id="nav"
        className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-5 md:px-12 h-16 transition-all ${
          navScrolled ? 'bg-[rgba(26,51,41,0.97)] backdrop-blur-md shadow-lg' : 'bg-transparent'
        } ${menuOpen ? 'menu-open' : ''}`}
      >
        <a href="/" className="text-white text-xl font-bold font-serif">
          Moderní<span className="text-[#D4B896]">Koberce</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none">
          <li><a href="/koberce" className="text-white/80 text-sm font-medium hover:text-[#D4B896] transition">Galerie</a></li>
          <li><a href="/koberce/cervene" className="text-white/80 text-sm font-medium hover:text-[#D4B896] transition">Červené</a></li>
          <li><a href="/koberce/vlnene" className="text-white/80 text-sm font-medium hover:text-[#D4B896] transition">Vlněné</a></li>
          <li><a href="/koberce/shaggy" className="text-white/80 text-sm font-medium hover:text-[#D4B896] transition">Shaggy</a></li>
          <li><a href="/koberce" className="bg-[#C4724A] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#d4835b] transition">Prohlédnout galerii</a></li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-white rounded transition-all"></span>
          <span className="block w-6 h-0.5 bg-white rounded transition-all"></span>
          <span className="block w-6 h-0.5 bg-white rounded transition-all"></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A3329] pt-16">
        {/* Pattern background */}
        <div
          className="absolute inset-0 opacity-12"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, #D4B896 0px, #D4B896 1px, transparent 1px, transparent 28px),
              repeating-linear-gradient(-45deg, #D4B896 0px, #D4B896 1px, transparent 1px, transparent 28px)
            `,
          }}
        ></div>

        {/* Medallion */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[min(480px,48vw)] aspect-square opacity-7 pointer-events-none">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="1" />
            <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="50" stroke="white" strokeWidth="1" />
            <path d="M200 50 L220 180 L350 200 L220 220 L200 350 L180 220 L50 200 L180 180 Z" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M200 100 Q240 150 200 200 Q160 150 200 100Z" stroke="white" strokeWidth="1" fill="none" />
            <path d="M300 200 Q250 240 200 200 Q250 160 300 200Z" stroke="white" strokeWidth="1" fill="none" />
            <path d="M200 300 Q160 250 200 200 Q240 250 200 300Z" stroke="white" strokeWidth="1" fill="none" />
            <path d="M100 200 Q150 160 200 200 Q150 240 100 200Z" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,51,41,0.85)] via-[rgba(26,51,41,0.3)] to-[rgba(26,51,41,0.55)]"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 md:px-12 py-24">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#D4B896] mb-5 uppercase">
            <span className="block w-7 h-px bg-[#D4B896]"></span>
            Srovnání koberců online
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-5">
            Najděte koberec,<br />který sedí<br /><em className="text-[#D4B896] not-italic">přesně k vám.</em>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-md mb-10 font-light leading-relaxed">
            Tisíce koberců od ověřených prodejců. Filtrujte podle barvy, materiálu a rozměru – a kupte přímo u prodejce za nejlepší cenu.
          </p>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <input
              type="text"
              className="w-full px-5 py-4 rounded-lg border border-[rgba(212,184,150,0.35)] bg-[rgba(255,255,255,0.10)] backdrop-blur-lg text-white placeholder:text-white/50 outline-none focus:border-[#D4B896] focus:bg-[rgba(255,255,255,0.14)] transition"
              placeholder="Hledat: červený koberec 200x300, vlněný shaggy…"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowAutocomplete(true);
              }}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setShowAutocomplete(true)}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#C4724A] hover:bg-[#d4835b] text-white px-4 py-2 rounded transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Autocomplete */}
            {showAutocomplete && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-2xl overflow-hidden z-50">
                {autocompleteItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigateTo(item.path)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A18] hover:bg-[#EDE0CF] cursor-pointer border-b border-black/5 last:border-b-0 transition"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#8A8A84] flex-shrink-0">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    {item.label}
                    <span className="ml-auto text-xs font-semibold text-[#8A8A84] bg-[#F7F4EF] px-2 py-1 rounded-full">{item.tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-10 flex-wrap">
            <div className="flex flex-col">
              <strong className="font-serif text-2xl font-bold text-[#D4B896]">2 400+</strong>
              <span className="text-xs text-white/55 mt-0.5">produktů online</span>
            </div>
            <div className="flex flex-col">
              <strong className="font-serif text-2xl font-bold text-[#D4B896]">od 299 Kč</strong>
              <span className="text-xs text-white/55 mt-0.5">nejnižší ceny</span>
            </div>
            <div className="flex flex-col">
              <strong className="font-serif text-2xl font-bold text-[#D4B896]">12 filtrů</strong>
              <span className="text-xs text-white/55 mt-0.5">pro přesné hledání</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/35 text-xs tracking-widest uppercase">
          <span>Scrolluj</span>
          <div className="scroll-hint-line w-px h-8 bg-gradient-to-b from-white/40 to-transparent"></div>
        </div>
      </section>

      {/* FILTER PILLS */}
      <div className="pt-10 pb-0">
        <div className="max-w-4xl mx-auto px-5 md:px-12">
          <div className="text-xs text-[#8A8A84] font-medium mb-3 uppercase tracking-widest">Oblíbené filtry</div>
          <div className="flex gap-2 flex-wrap">
            {filterPills.map((pill, idx) => (
              <a
                key={idx}
                href={pill.path}
                className="bg-white border border-[rgba(26,51,41,0.12)] rounded-full px-4 py-2 text-sm text-[#1A1A18] font-medium hover:border-[#1A3329] hover:bg-[#1A3329] hover:text-white transition whitespace-nowrap"
              >
                {pill.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20 px-5 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#C4724A] mb-2 uppercase">Kategorie</div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A18] mb-2">Populární kolekce</h2>
          <p className="text-base text-[#4A4A46] mb-8 max-w-md">Vyberte kategorii a ihned filtrujte stovky koberců.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <a
                key={idx}
                href={cat.path}
                className={`fade-up relative rounded-lg overflow-hidden cursor-pointer text-decoration-none block shadow-md hover:shadow-xl hover:-translate-y-1 transition ${
                  cat.featured ? 'md:col-span-2 aspect-video' : 'aspect-video'
                }`}
              >
                <div className={`absolute inset-0 cat-${cat.color}`}></div>
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 14px),
                      repeating-linear-gradient(-45deg, rgba(255,255,255,0.6) 0, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 14px)
                    `,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/0"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-serif text-lg font-semibold text-white">{cat.name}</div>
                  <div className="text-sm text-white/65">{cat.desc}</div>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-[#C4724A] group-hover:rotate-45 transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#1A3329] py-16 md:py-20 px-5 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#D4B896] mb-2 uppercase">Jak to funguje</div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-2">Tři jednoduché kroky</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { num: '1', title: 'Vyberte filtry', desc: 'Zvolte barvu, materiál, rozměr a další parametry' },
              { num: '2', title: 'Porovnejte ceny', desc: 'Vidíte všechny dostupné koberce od různých prodejců' },
              { num: '3', title: 'Kupte přímo', desc: 'Klikněte a jděte přímo na web prodejce za nejlepší cenou' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-[rgba(212,184,150,0.12)] border border-[rgba(212,184,150,0.2)] flex items-center justify-center text-[#D4B896] font-bold">
                  {step.num}
                </div>
                <div>
                  <div className="font-serif text-lg font-semibold text-white">{step.title}</div>
                  <div className="text-sm text-white/55 mt-2">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-5 md:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs font-bold tracking-widest text-[#C4724A] mb-2 uppercase">Připraveni?</div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A18] mb-4">Začněte hledáním</h2>
          <p className="text-base text-[#4A4A46] mb-8">Najděte si koberec, který se vám líbí. Porovnejte ceny a kupte přímo u prodejce.</p>
          <a
            href="/koberce"
            className="inline-flex items-center gap-2 bg-[#1A3329] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2C5041] hover:-translate-y-0.5 transition shadow-md hover:shadow-lg"
          >
            Prohlédnout galerii
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A18] text-white/50 py-8 px-5 md:px-12 text-center text-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="font-serif text-lg font-bold text-white">
            Moderní<span className="text-[#D4B896]">Koberce</span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="/koberce" className="text-[#D4B896] hover:text-white transition">Galerie</a>
            <a href="#" className="text-[#D4B896] hover:text-white transition">O nás</a>
            <a href="#" className="text-[#D4B896] hover:text-white transition">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
