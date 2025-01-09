// "use client";
// import React, { useEffect } from 'react';

// const GoogleTranslate = () => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//     script.async = true;
//     document.body.appendChild(script);

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: 'en',
//           // layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//         },
//         'google_translate_element'
//       );

//       // Apply custom styles after the widget is initialized
//       const style = document.createElement('style');
//       style.innerHTML = `
//         .goog-te-banner-frame.skiptranslate { display: none !important; }
//         body { top: 0 !important; }
//         .goog-te-gadget-icon { display: none !important; }
//         .goog-te-gadget-simple {
//           background-color: #fff !important;
//           border: 1px solid #e5e7eb !important;
//           padding: 0.5rem !important;
//           border-radius: 0.375rem !important;
//           width: 100% !important;
//           display: flex !important;
//           justify-content: space-between !important;
//         }
//         .goog-te-menu-value {
//           color: #374151 !important;
//         }
//         .goog-te-menu2 {
//           max-height: 90vh !important;
//           overflow-y: auto !important;
//         }
//         .goog-te-menu-frame.skiptranslate {
//           max-height: 90vh !important;
//           overflow-y: auto !important;
//         }
//       `;
//       document.head.appendChild(style);
//     };
//   }, []);

//   return (
//     <div className="w-screen overflow-x-hidden border border-gray-800 rounded-md shadow-md bg-black">
//       <div id="google_translate_element" className="w-full text-white"></div>
//     </div>
//   );
// };

// export default GoogleTranslate;


"use client";
import React, { useEffect, useRef } from 'react';

const GoogleTranslate = () => {
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (scriptAdded.current) return;
    scriptAdded.current = true;

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          // layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );

      // Apply custom styles after the widget is initialized
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0 !important; }
        .goog-te-gadget-icon { display: none !important; }
        .goog-te-gadget-simple {
          background-color: #fff !important;
          border: 1px solid #e5e7eb !important;
          padding: 0.5rem !important;
          border-radius: 0.375rem !important;
          width: 100% !important;
          display: flex !important;
          justify-content: space-between !important;
        }
        .goog-te-menu-value {
          color: #374151 !important;
        }
        .goog-te-menu2 {
          max-height: 90vh !important;
          overflow-y: auto !important;
        }
        .goog-te-menu-frame.skiptranslate {
          max-height: 90vh !important;
          overflow-y: auto !important;
        }
      `;
      document.head.appendChild(style);
    };
  }, []);

  return (
    <div className="w-screen overflow-x-hidden border border-gray-800 rounded-md shadow-md bg-black">
      <div id="google_translate_element" className="w-full text-white"></div>
    </div>
  );
};

export default GoogleTranslate;
