import axios from "axios";
import { toast } from "sonner";
import { Data } from "../[id]/page";

type Values = {
  value: Data;
  key: string;
  solved: boolean;
  selected: boolean;
};

export const bulkSolve = async (
  values: Array<Values>,
  setValues: React.Dispatch<React.SetStateAction<Array<Values>>>, 
  setAction: React.Dispatch<React.SetStateAction<string | string[] | null>>,
  setWorkingOn: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const selectedKeys = values
    .filter((item) => !item.solved && item.selected)
    .map((item) => item.key);

  if (
    selectedKeys.length === 0 &&
    values
      .filter((item) => item.solved && item.selected)
      .map((item) => item.key).length > 0
  ) {
    toast.info(`Selected error(s) already resolved.`);
    return;
  }

  if (selectedKeys.length === 0) {
    toast.warning("No items selected");
    return;
  }

  setAction("update");

  try {
    const response = await fetch(`${location.href}/actions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keys: selectedKeys,
        data: { solved: true },
      }),
    });

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let toastID: number | string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process each complete event
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        if (event.startsWith("data: ")) {
          try {
            const data = JSON.parse(event.slice(6).trim());

            if (data.type === "progress") {
              if (toastID) toast.dismiss(toastID);
              toastID = toast.loading(
                `Processing ${data.current} of ${data.total}...`
              );
            } else if (data.type === "complete") {
              if (toastID) toast.dismiss(toastID);
              toast.success(data.message);
              setValues((value) =>
                value.map((item) =>
                  selectedKeys.includes(item.key)
                    ? { ...item, solved: true, selected: false }
                    : item
                )
              );
              setWorkingOn((current) =>
                current && selectedKeys.includes(current) ? null : current
              );
            } else if (data.type === "error") {
              if (toastID) toast.dismiss(toastID);
              toast.error(data.message);
            }
          } catch (e) {
            console.error("Error parsing event:", e);
          }
        }
      }
    }
  } catch (error: any) {
    console.error("Bulk operation failed:", error);
    toast.error("Failed to complete bulk operation");
  } finally {
    setAction(null);
    setValues((prev) =>
      prev.map((item) =>
        values
          .filter((item) => item.selected)
          .map((item) => item.key)
          .includes(item.key)
          ? { ...item, selected: false }
          : item
      )
    );
  }
};

export const bulkDelete = async (
  keys: string[],
  setAction: React.Dispatch<React.SetStateAction<string | string[] | null>>,
  setValues: React.Dispatch<React.SetStateAction<Array<Values>>>, 
  actionKey?: string
) => {
  if (keys.length === 0) {
    toast.warning("No items selected");
    return;
  }

  try {
    setAction(actionKey || "delete");
    await axios.delete(`${location.href}/actions`, {
      data: { keys: keys },
    });

    setValues((prevValues) =>
      prevValues.filter((item) => !keys.includes(item.key))
    );

    toast.success(`Deleted ${keys.length} items`);
  } catch (error: any) {
    console.error("Failed to delete items:", error);
    toast.error(
      `Failed to delete items: ${ 
        error.response?.data?.message || error.message
      }`
    );
  } finally {
    setAction(null);
  }
};

export const normalDelete = async (
  key: string,
  setAction: React.Dispatch<React.SetStateAction<string | string[] | null>>,
  setValues: React.Dispatch<React.SetStateAction<Array<Values>>>
) => {
  try {
    setAction((prev) => (prev ? [...prev, `${key}del`] : [`${key}del`]));
    await axios.delete(`${location.href}/actions`, {
      data: { keys: [key] },
    });

    setValues((values) => values.filter((item) => item.key !== key));
    toast.success(`Log(${key}) has been successfully deleted`);
  } catch (error: any) {
    console.error("Failed to delete item:", error);
    toast.error(
      `Failed to delete item: ${ 
        error.response?.data?.message || error.message
      }`
    );
  } finally {
    setAction((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((item) => item !== `${key}del`);
      }
      return prev;
    });
  }
};

export const normalUpdate = async (
  key: string,
  setAction: React.Dispatch<React.SetStateAction<string | string[] | null>>,
  setValues: React.Dispatch<React.SetStateAction<Array<Values>>>,
  setWorkingOn: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    setAction((prev) => (prev ? [...prev, `${key}up`] : [`${key}up`]));
    await axios.put(`${location.href}/actions`, {
      keys: [key],
      data: { solved: true },
    });

    setValues((values) =>
      values.map((item) =>
        key === item.key ? { ...item, solved: true, selected: false } : item
      )
    );
    setWorkingOn((current) => (current === key ? null : current));
    toast.success(`Log(${key}) has been successfully updated`);
  } catch (error: any) {
    console.error("Failed to update item:", error);
    const message = `Failed to update item: ${ 
      error.response?.data?.message || error.message
    }`;
    toast.error(message);
  } finally {
    setAction((prev) => {
      if (Array.isArray(prev)) {
        return prev.filter((item) => item !== `${key}up`);
      }
      return prev;
    });
  }
};
