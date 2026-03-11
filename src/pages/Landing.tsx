import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { addTask } from '@/store/tasksSlice';

const Landing = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      dispatch(addTask(value.trim()));
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 sm:px-12 pt-12 sm:pt-16">
        <h1 className="text-xs font-medium tracking-widest uppercase text-muted-foreground animate-fade-in">
          Monotask
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <div className="w-full max-w-lg space-y-12 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-light leading-tight tracking-tight text-foreground">
              What needs to be done?
            </h2>
          </div>

          <div className="border-b-2 border-foreground pb-3">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your first task, then press Enter"
              className="w-full bg-transparent text-xl font-serif outline-none placeholder:text-muted-foreground/50 caret-accent"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <Link
              to="/dashboard"
              className="text-xs text-muted-foreground tracking-widest uppercase hover:text-foreground transition-colors duration-200"
            >
              See your dashboard →
            </Link>
          </div>
        </div>
      </div>

      <footer className="px-6 sm:px-12 py-6">
        <p className="text-xs text-muted-foreground/50 tracking-wide">
          Tools for focused work.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
