module.exports = {
  content: [
    './index.html',
    './main.jsx',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        neonPurple: '#a259ff',
        neonTeal: '#2fffc1',
        neonPink: '#ff2fa0',
        neonGreen: '#2fff4f',
        glass: 'rgba(255,255,255,0.08)'
      },
      fontFamily: {
        cyber: ['Orbitron', 'Audiowide', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 20px 5px #a259ff, 0 0 40px 10px #2fffc1'
      }
    }
  },
  plugins: [],
};
