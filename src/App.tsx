import React from 'react';
import { Feed } from './components/Feed';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Newsfeed MVC – Milestones 1–3</h1>
        <p className="app-subtitle">
          React + TypeScript starter focusing on types, HTTP wrapper, and repository stub.
        </p>
      </header>
      <main>
        <Feed />
      </main>
    </div>
  );
}
