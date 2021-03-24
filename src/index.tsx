import { useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClickHandler = () => {
    console.log(input);
  };

  return (
    <div>
      <textarea
        rows={40}
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
