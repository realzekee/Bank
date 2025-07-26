import React, { useState } from 'react';

const themes = [
  { name: 'Purple', color: 'neonPurple' },
  { name: 'Teal', color: 'neonTeal' },
  { name: 'Pink', color: 'neonPink' },
  { name: 'Green', color: 'neonGreen' }
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('neonPurple');

  React.useEffect(() => {
    document.body.className = `bg-black text-white font-cyber ${theme}`;
  }, [theme]);

  return (
    <div className="flex gap-2 mb-4">
      {themes.map(t => (
        <button key={t.color} onClick={() => setTheme(t.color)} className={`px-4 py-2 rounded-full font-bold shadow-neon bg-${t.color} text-black`}>{t.name}</button>
      ))}
    </div>
  );
}
