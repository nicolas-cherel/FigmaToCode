import {
  run,
  flutterMain,
  tailwindMain,
  swiftuiMain,
  convertIntoAltNodes,
} from "backend";

switch (figma.mode) {
  case "default":
  case "panel":
    let mode: "flutter" | "swiftui" | "html" | "tailwind";
    let isJsx = false;
    let layerName = false;

    figma.showUI(__html__, { width: 450, height: 550, themeColors: true });
    figma.on("selectionchange", () => {
      run(mode);
    });
    figma.ui.onmessage = (msg) => {
      if (
        msg.type === "tailwind" ||
        msg.type === "flutter" ||
        msg.type === "swiftui" ||
        msg.type === "html"
      ) {
        mode = msg.type;
        run(mode);
      } else if (msg.type === "jsx" && msg.data !== isJsx) {
        isJsx = msg.data;
        run(mode);
      } else if (msg.type === "layerName" && msg.data !== layerName) {
        layerName = msg.data;
        run(mode);
      }
    };
    break;
  case "codegen":
    figma.on("codegen", ({ node }) => {
      const convertedSelection = convertIntoAltNodes([node], null);
      const blocks: CodegenResult[] = [
        {
          title: `Tailwind Code`,
          code: tailwindMain(
            convertedSelection,
            node.parent ? node.parent.id : null,
            true,
            false
          ),
          language: "HTML",
        },
        {
          title: `Flutter`,
          code: flutterMain(
            convertedSelection,
            node.parent ? node.parent.id : null,
            true
          ),
          language: "SWIFT",
        },
        {
          title: `SwiftUI`,
          code: swiftuiMain(
            convertedSelection,
            node.parent ? node.parent.id : null
          ),
          language: "SWIFT",
        },
        {
          title: `Settings`,
          code: "To change settings, export to\n CodeSandbox, and see a preview,\n click in the 'Plugins' tab above",
          language: "JSON",
        },
        // {
        //   title: `Tailwind Colors`,
        //   code: JSON.stringify(colors).split(", ").join(",\n"),
        //   language: "JSON",
        // },
      ];

      figma.showUI(__html__, { visible: false });
      return blocks;
    });
  default:
    break;
}