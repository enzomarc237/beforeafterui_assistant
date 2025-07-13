import { TechStack } from "../types";
import { CodeFile } from "../components/CodeManager";

// Simple unstyled profile card SVG
const beforeSvg = `
<svg width="320" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  <rect x="10" y="10" width="300" height="130" stroke="black" fill="lightgray"/>
  <circle cx="65" cy="75" r="40" fill="gray"/>
  <text x="125" y="60" font-family="Arial" font-size="20">John Doe</text>
  <text x="125" y="85" font-family="Arial" font-size="16">Developer</text>
</svg>
`;

// Modern, styled profile card SVG using a dark theme
const afterSvg = `
<svg width="320" height="150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#1e293b"/>
  <g transform="translate(10, 10)">
    <rect width="300" height="130" fill="#0f172a" rx="12" stroke="#334155"/>
    <circle cx="65" cy="65" r="40" fill="url(#grad1)"/>
    <image href="https://i.pravatar.cc/80?u=john" x="25" y="25" height="80" width="80" clip-path="url(#clipCircle)"/>
    <clipPath id="clipCircle">
      <circle cx="65" cy="65" r="40"/>
    </clipPath>
    <text x="125" y="55" font-family="sans-serif" font-size="22" font-weight="bold" fill="white">John Doe</text>
    <text x="125" y="80" font-family="sans-serif" font-size="16" fill="#94a3b8">Frontend Developer</text>
  </g>
</svg>
`;

const sampleCode = `import React from 'react';

const ProfileCard = () => {
  return (
    <div style={{ border: '1px solid black', padding: '10px', width: '300px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="https://i.pravatar.cc/80?u=john" 
          alt="John Doe" 
          style={{ borderRadius: '50%', width: '80px', height: '80px', marginRight: '20px' }} 
        />
        <div>
          <h2>John Doe</h2>
          <p>Developer</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
`;


export const EXAMPLE_DATA = {
    beforeImage: `data:image/svg+xml;base64,${btoa(beforeSvg)}`,
    afterImage: `data:image/svg+xml;base64,${btoa(afterSvg)}`,
    codeFiles: [
        { name: 'ProfileCard.jsx', content: sampleCode }
    ] as CodeFile[],
    stack: TechStack.React,
}
