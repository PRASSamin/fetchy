import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const parseCookies = (cookieString: string) => {
  return cookieString.split("; ").map((pair: string) => {
    const [key, ...valParts] = pair.split("=");
    return { key, value: valParts.join("=") };
  });
};

export const CookieDisplay = ({ raw }: { raw: string }) => {
  const cookies = parseCookies(raw);

  return (
    <div className="p-4 max-h-[500px] overflow-auto rounded-md border shadow-sm text-sm font-mono">
      <Table className="w-full table-auto border-collapse">
        <TableBody>
          {cookies.map(({ key, value }, idx) => (
            <TableRow key={idx} className="hover:bg-transparent">
              <TableCell className="w-1/3 font-medium break-all text-[#f1f1f1]">
                {key}
              </TableCell>
              <TableCell className="break-all text-gray-300">{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
