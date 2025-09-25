"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CookieDisplay } from "./components/CookieDisplay";
import { JSONDisplay } from "./components/JSONDisplay";
import Editor from "@monaco-editor/react";
import { Data } from "./page";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

const QRCodeWrapper = () => {
  const [url, setUrl] = useState("");
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white p-2 rounded-lg shadow-lg z-50">
      {url && (
        <QRCodeCanvas
          value={url}
          size={isHover ? 512 : 128}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="transition-all duration-300"
          bgColor={"#ffffff"}
          fgColor={"#000000"}
        />
      )}
    </div>
  );
};

const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// Checks if value is JSON serializable
export const isJson = (value: any) => {
  try {
    const parsed = JSON.parse(JSON.stringify(value));
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
};

const statusCodeColor = (code: number) => {
  if (code >= 100 && code < 200) {
    return "bg-blue-400/40";
  } else if (code >= 200 && code < 300) {
    return "bg-green-500/40";
  } else if (code >= 300 && code < 400) {
    return "bg-cyan-400/40";
  } else if (code >= 400 && code < 500) {
    return "bg-orange-500/40";
  } else if (code >= 500 && code < 600) {
    return "bg-red-500/40";
  } else {
    return "bg-gray-600/40";
  }
};

// Pretty-render
export const renderValue = ({ key, value }: { key?: string; value: any }) => {
  if (typeof key === "string" && key?.toLowerCase() === "cookie")
    return <CookieDisplay raw={value} />;
  if (key === "status")
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-mono font-bold ${statusCodeColor(
          value
        )}`}
      >
        {value}
      </span>
    );
  if (typeof value === "boolean") {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-mono font-bold ${
          value ? "bg-green-500/50" : "bg-red-500/50"
        }`}
      >
        {value.toString()}
      </span>
    );
  }
  if (isJson(value)) return <JSONDisplay raw={JSON.stringify(value)} />;
  if (typeof value === "string" && isUrl(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {value}
      </a>
    );
  }
  return (
    value?.toString() ?? (
      <span className="text-muted-foreground italic">null</span>
    )
  );
};

export const renderType = (value: any) => {
  const type = typeof value;
  switch (type) {
    case "object":
      switch (Array.isArray(value)) {
        case true:
          return (
            <span className="bg-[#228B22]/50 px-2 py-1 rounded-full text-[10px] font-mono font-bold text-white">
              Array
            </span>
          );
        case false:
          return (
            <span className="bg-[#C71585]/50 px-2 py-1 rounded-full text-[10px] font-mono font-bold text-white">
              Object
            </span>
          );
      }
      break;
    default:
      return null;
  }
};

const KeyValueTable = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, any>;
}) => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight mb-6">{title}</h1>
    <div className="overflow-x-auto rounded-lg border border-[#2a2a2a]">
      <Table className="min-w-full text-sm">
        <TableHeader className="bg-[#1a1a1d]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-1/3 text-white">Key</TableHead>
            <TableHead className="text-white">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-[#121212] divide-y divide-[#2a2a2a]">
          {data &&
            Object.entries(data).map(([key, value]) => (
              <TableRow key={key} className="hover:bg-transparent">
                <TableCell className="w-1/3 font-medium break-all text-[#f1f1f1]">
                  {key} {renderType(value)}
                </TableCell>
                <TableCell className="break-all text-gray-300">
                  {renderValue({ key, value })}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default function RequestDetailsView({
  data,
  id,
}: {
  data: Data;
  id: string;
}) {
  if (!data) {
    return (
      <main className="w-[calc(100vw-2rem)] md:container mx-auto">
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <div className="max-w-md p-8 bg-background rounded-lg flex flex-col items-center justify-center">
            <h2 className="font-mono text-center text-2xl text-white/90">
              Request Expired
            </h2>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              This request data is no longer available. Requests are stored in
              cache for 30 minutes.
            </p>
            <code className="text-xs absolute bottom-5 left-1/2 -translate-x-1/2 text-muted-foreground">
              {id}
            </code>
          </div>
        </div>
      </main>
    );
  }

  const { body = {}, headers = {}, cookies = {}, response, ...rest } = data;

  return (
    <main className="min-h-screen w-full px-4 md:px-10 py-12 bg-[#0e0e10] text-white space-y-10">
      <QRCodeWrapper />
      <KeyValueTable title="Request Headers" data={headers} />
      <KeyValueTable title="Body" data={body} />
      <KeyValueTable title="Others" data={rest} />
      <KeyValueTable
        title="Response"
        data={
          response
            ? {
                status: response.status,
                ...(response.result?.data || response.result || {}),
              }
            : { status: "No response" }
        }
      />

      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          Full Raw Data (JSON)
        </h2>
        <div className="p-3 rounded-sm bg-[#1e1e1e]">
          <Editor
            height={`${
              JSON.stringify(data, null, 2).split("\n").length * 19 + 10
            }px`}
            options={{
              wordBreak: "keepAll",
              lineNumbers: "on",
              minimap: {
                enabled: false,
              },
              scrollBeyondLastLine: false,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
              },
              readOnly: true,
              lineHeight: 19,
              fontSize: 14,
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              glyphMargin: false,
              folding: false,
              lineNumbersMinChars: 0,
              lineDecorationsWidth: 0,
              renderLineHighlightOnlyWhenFocus: true,
            }}
            theme="vs-dark"
            defaultLanguage="json"
            value={JSON.stringify(data, null, 2)}
          />
        </div>
      </div>
    </main>
  );
}
