import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    onScoreChange?.(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          const nextScore = score + 10;
          setScore(nextScore);
          onScoreChange?.(nextScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#0891b2'; // Cyan
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = '#00ffff';
      
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.fillRect(x, y, size, size); // Sharper pixel look
    });

    // Draw Food
    ctx.fillStyle = '#ff00ff'; // Magenta / Fuchsia
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#ff00ff';
    const foodSize = cellSize - 4;
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      foodSize,
      foodSize
    );

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div id="snake-game-container" className="relative group p-4 bg-black border-4 border-white shadow-[8px_8px_0px_#ff00ff]">
      <canvas
        ref={canvasRef}
        id="snake-canvas"
        width={400}
        height={400}
        className="bg-black transition-all duration-100 group-hover:scale-[1.01]"
      />
      
      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-none z-50">
          {isGameOver ? (
            <div className="text-center px-10">
              <h2 
                data-text="SYSTEM_FAILURE"
                className="text-6xl font-black text-white mb-8 tracking-tighter uppercase font-mono tear-effect"
              >
                SYSTEM_FAILURE
              </h2>
              <div className="bg-white p-8 mb-10 rotate-1">
                <p className="text-black font-mono text-[10px] uppercase tracking-[0.4em] mb-4 font-bold">ERROR_LOG_0xDEADBEEF</p>
                <p className="text-6xl font-black text-black font-mono tracking-tighter">
                  {score.toString().padStart(4, '0')}
                </p>
              </div>
              <button
                onClick={resetGame}
                className="group relative px-16 py-6 bg-fuchsia-600 text-white font-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_#00ffff] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest font-mono text-xl"
              >
                REINIT_KERNEL
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p 
                data-text="AWAITING_INPUT"
                className="text-white font-mono text-3xl mb-10 tracking-[0.4em] tear-effect italic"
              >
                AWAITING_INPUT
              </p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-16 py-6 border-4 border-white text-white font-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_#ff00ff] uppercase tracking-widest font-mono text-xl"
              >
                BOOT_SEQUENCE
              </button>
              <p className="mt-8 text-[10px] font-mono text-cyan-400 uppercase tracking-[0.5em] opacity-80">HOLD_SPACE :: SYNC_START</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
