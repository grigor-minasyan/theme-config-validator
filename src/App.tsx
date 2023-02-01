import { useRef, useState } from "react";
import Editor, { type OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { initialThemeConfigStr, ThemeConfig, zErrorFormatter } from "./utils";

function App() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [errors, setErrors] = useState("Edit to see if there are any errors");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const handleFindChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFind(e.target.value);
  };
  const handleReplaceChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setReplace(e.target.value);
  };

  const handleFindAndReplace = () => {
    if (editorRef.current) {
      editorRef.current
        .getModel()
        ?.setValue(
          editorRef.current?.getModel()?.getValue().replaceAll(find, replace) ||
            ""
        );
    }
  };

  const handleFormat = () => {
    if (editorRef.current) {
      const value = editorRef.current?.getModel()?.getValue();
      if (!value) {
        return;
      }
      let formattedValue = "";
      try {
        formattedValue = JSON.stringify(JSON.parse(value), null, 2);
      } catch (e) {
        return;
      }
      editorRef.current.getModel()?.setValue(formattedValue);
    }
  };

  const handleEditorChange: OnChange = (value, event) => {
    if (!value) {
      setErrors("no value was provided");
      return;
    }
    let themeConfigParsed;
    try {
      themeConfigParsed = JSON.parse(value);
    } catch (e) {
      setErrors("no valid JSON was provided");
      return;
    }
    const zResults = ThemeConfig.safeParse(themeConfigParsed);
    if (!zResults.success) {
      setErrors(zErrorFormatter(zResults.error.format()));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Editor
        height="95vh"
        width="50vw"
        defaultLanguage="json"
        defaultValue={initialThemeConfigStr}
        onChange={handleEditorChange}
        onMount={(editor, monaco) => (editorRef.current = editor)}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <input placeholder="Quick find" onChange={handleFindChange}></input>
          <input
            placeholder="And replace"
            onChange={handleReplaceChange}
          ></input>
          <button onClick={handleFindAndReplace}>Find and replace</button>
        </div>
        <br />
        <button onClick={handleFormat}>Format if valid json</button>
        <h2>Errors</h2>
        <div style={{ whiteSpace: "pre" }}>{errors}</div>
      </div>
    </div>
  );
}

export default App;
