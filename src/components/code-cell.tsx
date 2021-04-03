import React, { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClickHandler = async () => {
    const output = await bundle(input);

    setCode(output);
  };

  return (
    <Resizable direction={"vertical"}>
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
    </Resizable>
  );
};

export default CodeCell;
