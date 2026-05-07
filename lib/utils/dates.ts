import { formatISO } from "date-fns";

export function nowIso() {
  return formatISO(new Date());
}
