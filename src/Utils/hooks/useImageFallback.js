// src/hooks/useImageFallback.js
import { useState } from "react";

export default function useImageFallback(src, fallback) {
  const [imgSrc, setImgSrc] = useState(src);

  function handleError() {
    setImgSrc(fallback);
  }

  return { imgSrc, handleError };
}
