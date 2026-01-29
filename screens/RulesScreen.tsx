import React from 'react';

interface Props {
  onBack: () => void;
}

const RulesScreen: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-4 bg-slate-800 shadow-md flex items-center z-10 shrink-0">
        <button onClick={onBack} className="text-slate-400 hover:text-white mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-yellow-500 tracking-wider">KOMPEDIUM ZASAD</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Cel Gry */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h2 className="text-lg font-bold text-indigo-400 mb-2 uppercase">Cel Gry</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
                Posegreguj wszystkie kulki w probówkach tak, aby każda probówka zawierała kulki tylko jednego koloru.
            </p>
        </div>

        {/* Tryb Przygody */}
        <div className="bg-red-900/20 p-4 rounded-xl border border-red-800">
            <h2 className="text-lg font-bold text-red-400 mb-2 uppercase flex items-center gap-2">
                <span>🏰</span> Tryb Przygody (100 Poziomów)
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Czeka na Ciebie <strong>100 poziomów</strong> o rosnącym poziomie trudności. Im dalej, tym więcej kolorów i mniej pustych probówek.
            </p>
            <div className="bg-slate-900/50 p-3 rounded-lg">
                <strong className="text-red-300 text-xs uppercase block mb-1">Uwaga na Bossa!</strong>
                <p className="text-xs text-slate-400">
                    Co 10 poziomów (10, 20, 30...) spotkasz <strong>Szalonego Naukowca</strong>. 
                    Będzie on próbował Ci przeszkodzić, mieszając probówki, zamrażając kulki lub wrzucając beton.
                </p>
            </div>
        </div>

        {/* --- Istniejące mechaniki --- */}
        <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2">Kule Specjalne</h2>
             
            {/* Lód */}
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full border-4 border-white bg-cyan-100 flex items-center justify-center relative shadow-lg">
                    <div className="absolute top-1 left-2 w-3 h-1 bg-white/90 rounded-full rotate-[-45deg] blur-[1px]"></div>
                </div>
                <div>
                    <h3 className="text-cyan-300 font-bold text-md">Lodowa Kulka</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Zamarznięta. Kliknij w nią <strong>3 razy</strong>, aby skruszyć lód.
                    </p>
                </div>
            </div>

            {/* Kamień */}
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-stone-700 flex items-center justify-center border-2 border-stone-600 shadow-inner overflow-hidden">
                    <div className="w-6 h-6 border-2 border-stone-500 rounded bg-stone-600 rotate-12"></div>
                </div>
                <div>
                    <h3 className="text-slate-300 font-bold text-md">Kamień</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Blokuje dno. Zniszcz go układając nad nim 3 identyczne kulki (lub użyj Kilofa).
                    </p>
                </div>
            </div>

            {/* Ukryta Kulka */}
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-slate-600 flex items-center justify-center shadow-inner relative border border-slate-500">
                    <span className="text-slate-400 font-bold text-xl drop-shadow-md">?</span>
                </div>
                <div>
                    <h3 className="text-slate-300 font-bold text-md">Ukryta Kulka</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Jej kolor jest nieznany. Odkryjesz go dopiero, gdy zabierzesz wszystkie kulki leżące nad nią.
                    </p>
                </div>
            </div>

            {/* Kłódka */}
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-black/80 flex items-center justify-center border-2 border-slate-500 shadow-lg relative">
                     <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/></svg>
                </div>
                <div>
                    <h3 className="text-slate-100 font-bold text-md">Kłódka</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Blokuje kulkę. Aby ją usunąć, musisz położyć na niej <strong>Klucz</strong> tego samego koloru.
                    </p>
                </div>
            </div>

            {/* Klucz */}
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-yellow-900/50 flex items-center justify-center border-2 border-yellow-600 shadow-lg relative">
                     <svg className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65z"/></svg>
                </div>
                <div>
                    <h3 className="text-yellow-400 font-bold text-md">Klucz</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Służy do otwierania kłódek. Po użyciu znika razem z kłódką.
                    </p>
                </div>
            </div>

             {/* Wirus */}
             <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-green-900 flex items-center justify-center border-2 border-lime-500 shadow-lg relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-50"></div>
                     <svg className="w-8 h-8 text-lime-400 opacity-80 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                </div>
                <div>
                    <h3 className="text-lime-400 font-bold text-md">Wirus</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Niebezpieczny! Jeśli położysz go na innej kulce, <strong>zainfekuje ją</strong>, zmieniając jej kolor na swój.
                    </p>
                </div>
            </div>

            {/* Joker */}
            <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-inner relative">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] opacity-80"></div>
                </div>
                <div>
                    <h3 className="text-yellow-400 font-bold text-md">Joker</h3>
                    <p className="text-slate-400 text-xs mt-1">
                        Pasuje do każdego koloru.
                    </p>
                </div>
            </div>
        </div>

        {/* --- Powerupy --- */}
        <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2">Powerupy (Dostępne w Sklepie)</h2>
             
             <div className="grid grid-cols-1 gap-4">
                 
                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">↩️</span>
                     <div>
                         <strong className="text-indigo-400 block">Cofnij Ruch</strong>
                         <p className="text-xs text-slate-400">Wraca do stanu przed ostatnim ruchem. Przydatne przy pomyłkach.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🪄</span>
                     <div>
                         <strong className="text-purple-400 block">Magiczna Różdżka</strong>
                         <p className="text-xs text-slate-400">Zamienia wybraną kulkę w Jokera, który pasuje do wszystkiego.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">⛏️</span>
                     <div>
                         <strong className="text-stone-400 block">Kilof</strong>
                         <p className="text-xs text-slate-400">Niszczy kamień lub kłódkę na dnie probówki, odblokowując ją.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🔥</span>
                     <div>
                         <strong className="text-orange-400 block">Miotacz Ognia</strong>
                         <p className="text-xs text-slate-400">Natychmiast rozmraża wszystkie lodowe kulki na planszy.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">👁️</span>
                     <div>
                         <strong className="text-green-400 block">Rentgen</strong>
                         <p className="text-xs text-slate-400">Odkrywa wszystkie ukryte kulki na planszy, pokazując ich kolory.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🔨</span>
                     <div>
                         <strong className="text-red-400 block">Młot</strong>
                         <p className="text-xs text-slate-400">Rozbija (usuwa) jedną wierzchnią kulkę z wybranej probówki.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🖌️</span>
                     <div>
                         <strong className="text-pink-400 block">Pędzel</strong>
                         <p className="text-xs text-slate-400">Maluje wierzchnią kulkę na kolor tej, która znajduje się pod nią.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">🧲</span>
                     <div>
                         <strong className="text-blue-400 block">Magnes</strong>
                         <p className="text-xs text-slate-400">Ściąga wszystkie pasujące kulki z innych probówek do wybranej.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">⇄</span>
                     <div>
                         <strong className="text-teal-400 block">Zamiana</strong>
                         <p className="text-xs text-slate-400">Zamienia miejscami dwie wierzchnie kulki z dowolnych probówek.</p>
                     </div>
                 </div>

                 <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                     <span className="text-3xl">📥</span>
                     <div>
                         <strong className="text-yellow-400 block">Kieszeń</strong>
                         <p className="text-xs text-slate-400">Dodaje dodatkową, tymczasową probówkę o pojemności 1 kulki.</p>
                     </div>
                 </div>

             </div>
        </div>

        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default RulesScreen;