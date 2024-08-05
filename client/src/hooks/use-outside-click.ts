import { MutableRefObject, useEffect } from "react";

interface Props {
  ref: MutableRefObject<HTMLElement>;
  handle: () => void;
}

export function useOutsideClick({ ref, handle }: Props) {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handle();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, handle]);
}
