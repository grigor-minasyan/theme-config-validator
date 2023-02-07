import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { ThemeConfig, zErrorFormatter } from "./utils";
import { useBearStore } from "./store";

function App() {
  const { themeConfigStr, setThemeConfigStr } = useBearStore((state) => state);
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
    editorRef.current
      ?.getModel()
      ?.setValue(
        editorRef.current?.getModel()?.getValue().replaceAll(find, replace) ||
          ""
      );
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

  const handleEditorChange = (value?: string) => {
    if (!value) {
      setErrors("no value was provided");
      return;
    }
    setThemeConfigStr(value);
    let themeConfigParsed;
    try {
      themeConfigParsed = JSON.parse(value);
    } catch (e) {
      setErrors("no valid JSON was provided");
      return;
    }
    const zResults = ThemeConfig.safeParse(themeConfigParsed);
    setErrors(
      zResults.success
        ? "✅ No Errors found, great!"
        : zErrorFormatter(zResults.error.format())
    );
  };
  const handleConfigLinkSave = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("urlConfig", themeConfigStr);
    // @ts-expect-error
    window.location.search = urlParams;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUrlVal = urlParams.get("urlConfig");

    let foundValidJson = false;
    try {
      JSON.parse(currentUrlVal || "");
      foundValidJson = true;
    } catch (e) {}
    foundValidJson && currentUrlVal && setThemeConfigStr(currentUrlVal);

    handleEditorChange(
      foundValidJson && currentUrlVal ? currentUrlVal : themeConfigStr
    );
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Editor
        height="95vh"
        width="50vw"
        defaultLanguage="json"
        defaultValue={themeConfigStr}
        onChange={(v) => handleEditorChange(v)}
        onMount={(editor, monaco) => (editorRef.current = editor)}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1>Quick theme config validator for Simplr</h1>
        <p>
          Until the real one comes. This will also save the file locally
          whenever you edit, so refreshing won't delete any edits.
        </p>
        <p>
          Initially get it to a valid json state, then you can use the format
          button to make it cleaner. It will show all the errors below, which
          keys are missing any values, or are invalid.
        </p>
        <p>
          If you see that a key is Required, just add that key with {"{}"}{" "}
          value, then it will show what is missing inside that key.
        </p>
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
        <button onClick={handleConfigLinkSave}>
          Save config to the link for sharing
        </button>
        <h2>Errors</h2>
        <div style={{ whiteSpace: "pre" }}>{errors}</div>
      </div>
    </div>
  );
}

export default App;
