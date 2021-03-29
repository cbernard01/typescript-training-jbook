import React, { useRef } from "react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";

import "./code-editor.css";
import "./syntax.css";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  const onEditorDidMountHandler: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      //@ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatHandler = () => {
    const formatted = prettier
      .format(editorRef.current.getModel().getValue(), {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: false,
      })
      .replace(/\n$/, "");

    editorRef.current?.setValue(formatted);
  };

  return (
    <div className={"editor-wrapper"}>
      <button
        className={"button button-format is-primary is-small"}
        onClick={onFormatHandler}
      >
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        editorDidMount={onEditorDidMountHandler}
        height={"500px"}
        width={"1000px"}
        theme={"dark"}
        language={"javascript"}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorStyle: "block",
        }}
      />
    </div>
  );
};

export default CodeEditor;
