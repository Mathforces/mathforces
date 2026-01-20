import { useEffect, useRef, useCallback } from "react";

// MathJax type declarations
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: Element[]) => Promise<void>;
      typeset?: (elements?: Element[]) => void;
      startup?: {
        defaultPageReady?: () => Promise<void>;
      };
    };
  }
}

/**
 * Custom hook to automatically render MathJax when content changes
 * @param dependencies - Array of dependencies to watch for changes (like React state values)
 * @param delay - Delay in milliseconds before rendering (default: 100ms)
 * @returns A ref to attach to the container element and a manual render function
 */
export function useMathJax<T extends HTMLElement = HTMLDivElement>(
  dependencies: React.DependencyList = [],
  delay: number = 100
) {
  const contentRef = useRef<T>(null);

  // Function to render MathJax
  const renderMathJax = useCallback((element?: Element | null) => {
    if (typeof window === "undefined" || !window.MathJax) {
      return;
    }

    const targetElement = element || contentRef.current;

    if (targetElement) {
      // Use typesetPromise for better async handling
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([targetElement]).catch((err) => {
          console.error("MathJax typeset error:", err);
        });
      } else if (window.MathJax.typeset) {
        window.MathJax.typeset([targetElement]);
      }
    } else {
      // Typeset entire document if no specific element
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch((err) => {
          console.error("MathJax typeset error:", err);
        });
      } else if (window.MathJax.typeset) {
        window.MathJax.typeset();
      }
    }
  }, []);

  // Automatically re-render MathJax when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      renderMathJax();
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { contentRef, renderMathJax };
}
