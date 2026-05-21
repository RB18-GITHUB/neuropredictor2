import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, LayoutDashboard } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Dashboard', path: '/history' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-foreground">NeuroPredict AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            )}
          </button>
          <Link
            to="/predict"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Run Prediction
          </Link>
        </div>
      </div>
    </header>
  );
}
