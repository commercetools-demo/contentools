import React, { useEffect } from 'react';

function ScriptLoader({ src, id }: { src: string, id: string }) {
  useEffect(() => {
    // Check if the script already exists to avoid duplicates
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.id = id;
      script.async = true;
      
      // Append to the document head
      document.head.appendChild(script);
      
      // Clean up function to remove the script when component unmounts
      return () => {
        const scriptToRemove = document.getElementById(id);
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      };
    }
  }, [src, id]);

  return null; // This component doesn't render anything
}

export default ScriptLoader;