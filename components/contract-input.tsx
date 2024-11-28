

import React, { useRef } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-tomorrow.css";
import { IconChecklist, IconPaperclip, IconSend } from "@tabler/icons-react";

interface CustomCodeEditorProps {
  contract: string;
  setContract: React.Dispatch<React.SetStateAction<string>>;
  analyze: () => Promise<void>;
}

const highlightWithPrism = (code: string) => {
  return Prism.highlight(code, Prism.languages.solidity, "solidity");
};

const isValidSolidityContract = (code: string) => {
  const SPDXRegex = /\/\/\s*SPDX-License-Identifier:\s*[^\s]+/;
  const pragmaRegex = /pragma\s+solidity\s+[^;]+;/;
  return SPDXRegex.test(code) && pragmaRegex.test(code);
};

const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  contract,
  setContract,
  analyze,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    if (!isValidSolidityContract(contract)) {
      alert(
        "The provided code does not appear to be a valid Solidity smart contract. Make sure it starts with the SPDX license identifier and the 'pragma' directive."
      );
      return;
    }
    analyze();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContract(text);
      };
      reader.readAsText(file);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative lg:w-4/6 w-full mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".sol"
        className="hidden"
      />
      <div
        className="border outline-none border-r-2 border-white rounded-2xl p-6 bg-black dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
        style={{ height: "450px", overflowY: "auto" }}
      >
        <Editor
          value={contract}
          onValueChange={(code) => setContract(code)}
          highlight={(code) => highlightWithPrism(code)}
          padding={15}
          textareaId="code-editor"
          className="textarea-editor"
          textareaClassName="outline-none"
          style={{
            fontFamily: '"Fira Mono", monospace',
            fontSize: 17,
            minHeight: "100%",
            background: "rgba(0, 0, 0, 0.7)", // Black background with slight transparency
            color: "white",
            borderRadius: "0.75rem",
            padding: "10px",
          }}
        />
      </div>

      <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-black dark:bg-neutral-900">
        <div className="flex justify-between items-center pb-3">
          <div className="flex items-center">
            <button
              type="button"
              onClick={openFileExplorer}
              className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-400 hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
            >
              <IconPaperclip />
            </button>
          </div>

          <div className="flex cursor-pointer items-center gap-x-1">
            <button
              onClick={handleAnalyze}
              type="button"
              className="flex flex-row items-center space-x-2 px-6 py-1.5 justify-center rounded-full text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>Audit</span>
              <IconChecklist size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCodeEditor;