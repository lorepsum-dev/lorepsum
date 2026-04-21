import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="mt-4 font-display mb-3 text-xs uppercase tracking-[0.5em] text-primary-light/70">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
