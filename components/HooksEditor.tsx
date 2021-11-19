import React, { useEffect, useRef } from "react";
import { useSnapshot, ref } from "valtio";
import Editor from "@monaco-editor/react";
import type monaco from "monaco-editor";
import { ArrowBendLeftUp, Play } from "phosphor-react";
import { useTheme } from "next-themes";

import Box from "./Box";
import Button from "./Button";
import Container from "./Container";
import dark from "../theme/editor/amy.json";
import light from "../theme/editor/xcode_default.json";
import { compileCode, saveFile, state } from "../state";

import EditorNavigation from "./EditorNavigation";
import Text from "./Text";

const HooksEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const snap = useSnapshot(state);
  const { theme } = useTheme();
  return (
    <Box
      css={{
        flex: 1,
        flexShrink: 1,
        display: "flex",
        position: "relative",
        flexDirection: "column",
        backgroundColor: "$mauve3",
        width: "100%",
      }}
    >
      <EditorNavigation />
      {snap.files.length > 0 ? (
        <Editor
          keepCurrentModel
          defaultLanguage={snap.files?.[snap.active]?.language}
          path={snap.files?.[snap.active]?.name}
          defaultValue={snap.files?.[snap.active]?.content}
          beforeMount={(monaco) => {
            if (!state.editorCtx) {
              state.editorCtx = ref(monaco.editor);
              // @ts-expect-error
              monaco.editor.defineTheme("dark", dark);
              // @ts-expect-error
              monaco.editor.defineTheme("light", light);
            }
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            // hook editor to global state
            editor.updateOptions({
              minimap: {
                enabled: false,
              },
              ...snap.editorSettings,
            });
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
              () => {
                saveFile(editor.getValue());
              }
            );
          }}
          theme={theme === "dark" ? "dark" : "light"}
        />
      ) : (
        <Container>
          <Box
            css={{
              flexDirection: "row",
              width: "$spaces$wide",
              gap: "$3",
              display: "inline-flex",
            }}
          >
            <Box css={{ display: "inline-flex", pl: "35px" }}>
              <ArrowBendLeftUp size={30} />
            </Box>
            <Box
              css={{ pl: "0px", pt: "15px", flex: 1, display: "inline-flex" }}
            >
              <Text
                css={{
                  fontSize: "14px",
                  maxWidth: "220px",
                  fontFamily: "$monospace",
                }}
              >
                Click the link above to create a your file (until we get the
                fancy modal, where you can select example files 😊)
              </Text>
            </Box>
          </Box>
        </Container>
      )}
      <Button
        variant="primary"
        uppercase
        disabled={!snap.files.length}
        isLoading={snap.compiling}
        onClick={() => compileCode(snap.active)}
        css={{
          position: "absolute",
          bottom: "$4",
          left: "$4",
          alignItems: "center",
          display: "flex",
          cursor: "pointer",
        }}
      >
        <Play weight="bold" size="16px" />
        Compile to Wasm
      </Button>
    </Box>
  );
};

export default HooksEditor;
