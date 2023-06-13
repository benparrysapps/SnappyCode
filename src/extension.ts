import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("snappycode.copy", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const text = document.getText();
    const fileType = document.languageId;

    let config = vscode.workspace.getConfiguration("snappycode");

    let formattedText = text;
    if (config.get("removeWhitespace")) {
      formattedText = removeWhitespace(formattedText);
    }
    if (config.get("removeComments")) {
      formattedText = removeComments(formattedText, fileType);
    }
    if (config.get("removeImports")) {
      formattedText = removeImports(formattedText, fileType);
    }
    if (config.get("removeEmptyLines")) {
      formattedText = removeEmptyLines(formattedText);
    }

    vscode.env.clipboard.writeText(formattedText).then(() => {
      vscode.window.showInformationMessage(
        "Copied to clipboard with SnappyCode!"
      );
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function removeWhitespace(text: string): string {
  return text.replace(/ {2,}/g, " ");
}

function removeComments(text: string, fileType: string): string {
  switch (fileType) {
    case "python":
      return text.replace(/#.*$/gm, "");
    case "javascript":
    case "typescript":
      return text
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    case "cpp":
      return text
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    case "java":
      return text
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    case "ruby":
      return text.replace(/#.*$/gm, "");
    default:
      return text;
  }
}

function removeImports(text: string, fileType: string): string {
  switch (fileType) {
    case "python":
      return text.replace(/import.*$/gm, "");
    case "javascript":
    case "typescript":
      return text.replace(/import.*$/gm, "");
    case "java":
      return text.replace(/import.*$/gm, "");
    case "cpp":
      return text.replace(/#include.*$/gm, "");
    case "ruby":
      return text.replace(/require.*$/gm, "");
    default:
      return text;
  }
}

function removeEmptyLines(text: string): string {
  return text.replace(/^\s*[\r\n]/gm, "");
}
