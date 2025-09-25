"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, ExternalLink, Loader2, Play, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { usePresence } from "@pras-ui/presence";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { bulkDelete, bulkSolve, normalDelete, normalUpdate } from "./utils";
import { Data } from "../[id]/page";

const ErrorRequestsVaultView = ({
  values,
}: {
  values: Array<{ value: Data; key: string }>;
}) => {
  const [localValues, setLocalValues] = useState<
    Array<{ value: Data; key: string; solved: boolean; selected: boolean }>
  >(
    values.map((item) => ({
      ...item,
      solved: item.value?.solved || false,
      selected: false,
    }))
  );
  const [workingOn, setWorkingOn] = useState<string | null>(null);
  const [isActionRunning, setIsActionRunning] = useState<
    string | string[] | null
  >(null);
  const selectedCount = localValues.filter((v) => v.selected).length;
  const solvedCount = localValues.filter((v) => v.solved).length;

  const { isPresent, ref } = usePresence(selectedCount > 0);
  const filterButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [filter, setFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0 });

  // Load from localStorage on mount
  useEffect(() => {
    const savedWorkingOn = localStorage.getItem("workingOnKey");
    if (savedWorkingOn) {
      setWorkingOn(savedWorkingOn);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (workingOn) {
      localStorage.setItem("workingOnKey", workingOn);
    } else {
      localStorage.removeItem("workingOnKey");
    }
  }, [workingOn]);

  useLayoutEffect(() => {
    const activeBtn = filterButtonRefs.current[filter];
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = activeBtn.parentElement!.getBoundingClientRect();
      setActiveStyle({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [filter]);

  // Toggle individual row selection
  const toggleRowSelection = (key: string) => {
    setLocalValues((prevValues) =>
      prevValues.map((item) =>
        item.key === key ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Toggle all rows selection
  const toggleAllSelection = () => {
    const allSelected = localValues.every((item) => item.selected);
    setLocalValues((prevValues) =>
      prevValues.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const filteredValues = localValues.filter((item) => {
    if (filter === "solved") return item.solved;
    if (filter === "unsolved") return !item.solved;
    return true;
  });

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-100 selection:bg-emerald-500/30">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with stats and filter */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-zinc-200 flex items-center gap-3">
              Error Logs
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                {localValues.length} total
              </span>
            </h1>
            <div className="relative bg-zinc-800 rounded-full p-1 flex items-center border border-zinc-700">
              {/* Sliding pill background */}
              <div
                className="absolute top-1 bottom-1 bg-indigo-500/30 rounded-full transition-all duration-300"
                style={{
                  left: activeStyle.left,
                  width: activeStyle.width,
                }}
              />

              {[
                { value: "all", label: "All" },
                { value: "unsolved", label: "Unsolved" },
                { value: "solved", label: "Solved" },
              ].map((option) => (
                <button
                  key={option.value}
                  ref={(el) => {
                    if (el) {
                      filterButtonRefs.current[option.value] = el;
                    }
                  }}
                  onClick={() =>
                    setFilter(option.value as "all" | "solved" | "unsolved")
                  }
                  className={`
                        relative z-10 px-3 py-1 text-xs rounded-full transition-colors duration-200
                        ${
                          filter === option.value
                            ? "text-indigo-300"
                            : "text-zinc-500 hover:text-zinc-300"
                        }
                      `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-zinc-800 text-zinc-300">
              Solved: {solvedCount}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors duration-200 group"
              disabled={isActionRunning === "auto_delete" || solvedCount === 0}
              onClick={() => {
                const solvedKeys = localValues
                  .filter((v) => v.solved)
                  .map((v) => v.key);
                bulkDelete(
                  solvedKeys,
                  setIsActionRunning,
                  setLocalValues,
                  "auto_delete"
                );
              }}
            >
              {isActionRunning === "auto_delete" ? (
                <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
              ) : (
                <Trash className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
              )}
              <span>Clear Solved</span>
            </Button>
          </div>
        </div>

        {/* Sticky bottom action bar */}
        {isPresent && (
          <div ref={ref} className={`fixed bottom-6 left-0 w-full z-50 px-4`}>
            <div className="bg-zinc-800/80 backdrop-blur-md border border-zinc-700 rounded-xl shadow-2xl p-4 max-w-3xl mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {selectedCount > 0 && (
                    <span className="text-zinc-400 text-sm">
                      {selectedCount} item(s) selected
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() =>
                      bulkSolve(
                        localValues,
                        setLocalValues,
                        setIsActionRunning,
                        setWorkingOn
                      )
                    }
                    disabled={isActionRunning === "update"}
                    className="group relative overflow-hidden bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition-all duration-300 rounded-full px-4 py-2"
                  >
                    <span className="relative z-10 flex items-center">
                      {isActionRunning === "update" ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
                      ) : (
                        <Check className="w-4 h-4 mr-1.5" />
                      )}
                      Solve Errors
                    </span>
                  </Button>
                  <Button
                    onClick={() => {
                      const selectedKeys = localValues
                        .filter((item) => item.selected)
                        .map((item) => item.key);
                      bulkDelete(
                        selectedKeys,
                        setIsActionRunning,
                        setLocalValues
                      );
                    }}
                    disabled={isActionRunning === "delete"}
                    className="group relative overflow-hidden bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600/30 transition-all duration-300 rounded-full px-4 py-2"
                  >
                    <span className="relative z-10 flex items-center">
                      {isActionRunning === "delete" ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : (
                        <Trash className="w-4 h-4 mr-2" />
                      )}
                      Delete Errors
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      localValues.length > 0 &&
                      localValues.every((item) => item.selected)
                    }
                    onCheckedChange={toggleAllSelection}
                    className="border-zinc-600"
                  />
                </TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Error Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredValues.map(({ value, key, solved, selected }) => {
                const data = value;
                const ip =
                  data.headers?.["x-real-ip"] ||
                  data.headers?.["x-forwarded-for"];

                return (
                  <TableRow
                    key={key}
                    className={`
                        transition-all duration-200 flex
                        ${
                          workingOn === key
                            ? "bg-yellow-500/10 hover:bg-yellow-500/15 !border-l-4 border-l-yellow-600"
                            : selected
                              ? "bg-indigo-500/10 hover:bg-indigo-500/15 !border-l-4 border-l-indigo-600 text-indigo-50"
                              : "hover:bg-zinc-700/30"
                        }
                        ${
                          solved
                            ? "opacity-60 bg-emerald-900/20 line-through text-emerald-300 hover:bg-emerald-900/30"
                            : ""
                        }
                        ${
                          !solved && !selected && workingOn !== key
                            ? "hover:bg-zinc-700/30 text-zinc-300"
                            : ""
                        }
                      `}
                  >
                    <TableCell className="flex items-center">
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleRowSelection(key)}
                        className="border-zinc-600"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-zinc-300 flex items-center">
                      {ip}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Badge
                        variant="outline"
                        className={`
                        ${
                          data?.response?.status >= 400
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        }
                      `}
                      >
                        {data?.response?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 max-w-xs truncate flex items-center">
                      {data?.response?.result?.error}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={`text-zinc-500 transition-colors ${
                                workingOn === key
                                  ? "!text-yellow-500"
                                  : "hover:text-yellow-500"
                              }`}
                              onClick={() =>
                                setWorkingOn((current) =>
                                  current === key ? null : key
                                )
                              }
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {workingOn === key ? "Unmark" : "Mark as Working"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={solved}
                              className="text-zinc-500 hover:text-emerald-500"
                              onClick={() =>
                                normalUpdate(
                                  key,
                                  setIsActionRunning,
                                  setLocalValues,
                                  setWorkingOn
                                )
                              }
                            >
                              {isActionRunning &&
                              isActionRunning.includes(`${key}up`) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {solved ? "Already Solved" : "Mark as Solved"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-zinc-500 hover:text-rose-500"
                              onClick={() =>
                                normalDelete(
                                  key,
                                  setIsActionRunning,
                                  setLocalValues
                                )
                              }
                            >
                              {isActionRunning &&
                              isActionRunning.includes(`${key}del`) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Error Log</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-zinc-500 hover:text-blue-500"
                              onClick={() => {
                                window.open(
                                  `${location.origin}/request/${key
                                    .split(":")
                                    .at(-1)}`,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Details</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right text-zinc-500">
                  Showing {localValues.length} logs | {solvedCount} solved
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default ErrorRequestsVaultView;
