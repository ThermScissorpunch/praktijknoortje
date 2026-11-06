import { notFound } from "next/navigation";

/**
 * Runs a Tina query and turns "record does not exist" into a real 404.
 * Without this, unknown URLs return 500, which search engines treat as a
 * server fault and keep retrying instead of dropping the URL.
 * Other errors (e.g. Tina Cloud unavailable) are rethrown on purpose: a 404
 * there could get real pages removed from the index.
 */
export async function queryOr404<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (String((error as Error)?.message ?? error).includes("Unable to find record")) {
      notFound();
    }
    throw error;
  }
}
