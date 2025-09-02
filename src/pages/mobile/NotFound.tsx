import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 hebrew-text">404</h1>
        <p className="text-xl text-muted-foreground mb-4 hebrew-text">אופס! הדף לא נמצא</p>
        <a href="/" className="text-primary hover:underline hebrew-text">
          חזרה לדף הבית
        </a>
      </div>
    </div>
  );
};

export default NotFound;
