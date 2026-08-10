import { useEffect } from "react";

export const useScrollToTopOnChange = (value: unknown) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [value]);
};
