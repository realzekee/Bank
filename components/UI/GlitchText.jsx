import React from 'react';

export default function GlitchText({ text }) {
  return (
    <span className="glitch" data-text={text}>{text}</span>
  );
}
