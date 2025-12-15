import React from 'react';
import './signin.css';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function SignInBackground({ children, title = 'Sign In' }: Props) {
  return (
    <div className="sb-root">
      <div className="sb-gradient" aria-hidden />

      <div className="sb-bubbles" aria-hidden>
        <span className="sb-bubble b1" />
        <span className="sb-bubble b2" />
        <span className="sb-bubble b3" />
        <span className="sb-bubble b4" />
        <span className="sb-bubble b5" />
        <span className="sb-bubble b6" />
      </div>

      <main className="sb-center">
        <div className="sb-card" role="region" aria-label="Authentication form">
          <div className="sb-card-header">
            <h1 className="sb-title">{title}</h1>
            <p className="sb-sub">Welcome back — capture a memory today</p>
          </div>

          <div className="sb-card-body">{children}</div>
        </div>
      </main>
    </div>
  );
}
