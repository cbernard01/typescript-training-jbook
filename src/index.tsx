import { useState } from "react";
import ReactDOM from "react-dom";

import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

import "bulmaswatch/superhero/bulmaswatch.min.css";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClickHandler = async () => {
    const output = await bundle(input);

    setCode(output);
  };

  return (
    <div>
      <CodeEditor initialValue={""} onChange={(value) => setInput(value)} />

      <div>
        <button
          className={"button button-format is-primary is-small"}
          onClick={onClickHandler}
        >
          Submit
        </button>
      </div>

      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
