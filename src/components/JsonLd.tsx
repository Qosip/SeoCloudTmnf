import { useEffect } from 'react';

interface JsonLdProps {
  data: any;
}

export default function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'schema-org-data';
    
    // Remove existing schema script if any
    const existing = document.getElementById('schema-org-data');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      if (script) {
        script.remove();
      }
    };
  }, [data]);

  return null;
}
