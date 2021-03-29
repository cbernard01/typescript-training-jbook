import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

const App = () => {
  const ref = useRef<any>();
  const iframeRef = useRef<any>();

  const [input, setInput] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  const onClickHandler = async () => {
    if (!ref.current) return;

    iframeRef.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: { "process.env.NODE_ENV": '"production"', global: "window" },
    });

    iframeRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      "*"
    );
  };

  useEffect(() => {
    startService().then();
  }, []);

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

  return (
    <div>
      <CodeEditor initialValue={""} onChange={(value) => setInput(value)} />
      <textarea
        rows={20}
        cols={100}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>

      <iframe
        ref={iframeRef}
        srcDoc={html}
        title={"preview"}
        sandbox={"allow-scripts"}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
