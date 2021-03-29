import React, { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
}

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.srcdoc = html;

    iframeRef.current.contentWindow.postMessage(code, "*");
  }, [code]);

  return (
    <iframe
      title={"preview"}
      ref={iframeRef}
      srcDoc={html}
      sandbox={"allow-scripts"}
    />
  );
};

export default Preview;

const html = `
  <html lang="en">
    <head>
      <title>"Test"</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"> <h4>Runtime Error</h4>' + error + '</div>'
            console.error(error);
          }
        }, false);
      </script>
    </body>
  </html>
  `;
