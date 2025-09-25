import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/utils";
import { renderType, renderValue } from "../view";

export const JSONDisplay = ({
  raw,
  nested = true,
  className,
}: {
  raw: string;
  nested?: boolean;
  className?: string;
}) => {
  const obj = JSON.parse(raw);

  return (
    <div
      className={cn(
        `p-4 max-h-[500px] overflow-auto rounded-md border shadow-sm text-sm font-mono`,
        className
      )}
    >
      <Table className="w-full table-auto border-collapse">
        <TableBody>
          {Array.isArray(obj)
            ? obj.map((value, idx) => {
                return (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="break-all text-gray-300">
                      {nested && typeof value === "object" ? (
                        <JSONDisplay
                          className={`max-h-full`}
                          raw={JSON.stringify(value)}
                          nested
                        />
                      ) : (
                        renderValue({ value })
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            : Object.entries(obj).map(([key, value], idx) => {
                return (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="w-1/3 font-medium break-all text-[#f1f1f1]">
                      {key} {renderType(value)}
                    </TableCell>
                    <TableCell className="break-all text-gray-300">
                      {nested && typeof value === "object" && value !== null ? (
                        <JSONDisplay raw={JSON.stringify(value)} nested />
                      ) : (
                        renderValue({ value })
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
};
