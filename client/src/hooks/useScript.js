import { useState, useEffect } from 'react';
const useScript = (src) => {
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(() => {
    if (!src) {
      setStatus("idle");
      return;
    }
    let script = document.querySelector(`script[src="${src}"]`);
    
    if (!script) {
        script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);

        const setAttributeFromEvent = (event) => {
            script.setAttribute("data-status", event.type === "load" ? "ready" : "error");
            setStatus(event.type === "load" ? "ready" : "error");
        };

        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
    } else {
        setStatus(script.getAttribute("data-status") || "ready");
    }

  }, [src]);

  return status;
};

export default useScript;