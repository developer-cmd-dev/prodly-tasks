import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addTask, toggleTask, deleteTask } from '@/store/tasksSlice';
import { Link } from 'react-router-dom';

const TaskItem = ({ task, isFirst }: { task: { id: string; text: string; completed: boolean }; isFirst: boolean }) => {
  const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const handleToggle = () => {
    setFadingOut(true);
    setTimeout(() => {
      dispatch(toggleTask(task.id));
    }, 300);
  };

  const handleDelete = () => {
    setFadingOut(true);
    setTimeout(() => {
      dispatch(deleteTask(task.id));
    }, 300);
  };

  return (
    <div
      className={`group flex items-center gap-4 py-4 border-b border-border/50 ${fadingOut ? 'animate-task-fade-out' : 'animate-fade-in'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-sm border-2 flex-shrink-0 transition-all duration-200 flex items-center justify-center ${
          isFirst && !task.completed
            ? 'border-accent hover:bg-accent'
            : 'border-foreground/30 hover:border-foreground'
        } ${task.completed ? 'bg-accent border-accent' : ''}`}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" className="text-accent-foreground" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-lg leading-relaxed transition-all duration-200 ${
          task.completed
            ? 'line-through text-muted-foreground font-sans'
            : hovered
              ? 'font-sans'
              : 'font-serif'
        }`}
      >
        {task.text}
      </span>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground text-sm tracking-wide uppercase"
      >
        remove
      </button>
    </div>
  );
};

const TaskInput = () => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      dispatch(addTask(value.trim()));
      setValue('');
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-5 h-5 rounded-sm border-2 border-border flex-shrink-0" />
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          className="w-full bg-transparent text-lg font-serif leading-relaxed outline-none placeholder:text-transparent caret-accent"
        />
        {!value && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground animate-cursor-blink" />
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const tasks = useAppSelector((state) => state.tasks.items);
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-border/50">
        <Link to="/" className="text-sm font-medium tracking-widest uppercase text-foreground">
          Monotask
        </Link>
        <span className="text-xs text-muted-foreground tracking-wide">
          {activeTasks.length} {activeTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </header>

      <main className="max-w-xl mx-auto px-6 sm:px-0 pt-12 pb-24">
        <div>
          {activeTasks.map((task, i) => (
            <TaskItem key={task.id} task={task} isFirst={i === 0} />
          ))}
          <TaskInput />
        </div>

        {completedTasks.length > 0 && (
          <div className="mt-16">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-xs text-muted-foreground tracking-widest uppercase hover:text-foreground transition-colors"
            >
              {showCompleted ? 'Hide' : 'Show'} completed ({completedTasks.length})
            </button>

            {showCompleted && (
              <div className="mt-4">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} isFirst={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
