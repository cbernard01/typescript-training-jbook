import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
  const ref = useRef<any>();

  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  const onClickHandler = async () => {
    if (!ref.current) return;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    setCode(result.outputFiles[0].text);
  };

  useEffect(() => {
    startService().then();
  }, []);

  return (
    <div>
      <textarea
        rows={20}
        cols={100}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>

      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
