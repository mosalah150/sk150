import { useEffect } from "react";

interface ShortcutOptions {
  metaKey?: boolean;
  preventDefault?: boolean;
}

export default function useKeyboardShortcut(
  targetKey: string,
  callback: () => void,
  options: ShortcutOptions = {},
) {
  const { metaKey = false, preventDefault = true } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyMatch = event.key.toLowerCase() === targetKey.toLowerCase();
      const isMetaMatch = !metaKey || event.metaKey || event.ctrlKey;

      if (isKeyMatch && isMetaMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetKey, callback, metaKey, preventDefault]);
}
