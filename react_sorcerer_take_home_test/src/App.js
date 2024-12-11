import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // Load saved content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  // Save content to localStorage
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
    alert("Content saved!");
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (input) => {
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(blockKey);
    const blockText = block.getText();

    if (blockText === "#" && input === " ") {
      const newContentState = Modifier.removeRange(
        contentState,
        selection,
        "backward"
      );
      const updatedContent = RichUtils.toggleBlockType(
        EditorState.push(editorState, newContentState, "remove-range"),
        "header-one"
      );
      setEditorState(updatedContent);
      return "handled";
    }

    if (blockText === "*" && input === " ") {
      const newContentState = Modifier.removeRange(
        contentState,
        selection,
        "backward"
      );
      const updatedContent = RichUtils.toggleInlineStyle(
        EditorState.push(editorState, newContentState, "remove-range"),
        "BOLD"
      );
      setEditorState(updatedContent);
      return "handled";
    }

    if (blockText === "**" && input === " ") {
      const newContentState = Modifier.removeRange(
        contentState,
        selection,
        "backward"
      );
      const updatedContent = Modifier.applyInlineStyle(
        EditorState.push(editorState, newContentState, "remove-range"),
        selection,
        "COLOR_RED"
      );
      setEditorState(updatedContent);
      return "handled";
    }

    if (blockText === "***" && input === " ") {
      const newContentState = Modifier.removeRange(
        contentState,
        selection,
        "backward"
      );
      const updatedContent = RichUtils.toggleInlineStyle(
        EditorState.push(editorState, newContentState, "remove-range"),
        "UNDERLINE"
      );
      setEditorState(updatedContent);
      return "handled";
    }

    return "not-handled";
  };

  const styleMap = {
    COLOR_RED: { color: "red" },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button
        style={{
          position: "absolute",
          top: "70px",
          right: "100px",
          padding: "5px 15px",
          border: "1px solid black",
          background: "white",
          cursor: "pointer",
        }}
        onClick={handleSave}
      >
        Save
      </button>
      <h1 style={{ textAlign: "center" }}>
        Demo editor by Samra Hifzur Rahman
      </h1>

      <div
        style={{
          border: "5px solid #a4c1e7",
          padding: "10px",
          minHeight: "300px",
          marginTop: "50px",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
};

export default App;
