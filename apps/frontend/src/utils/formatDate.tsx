import { timeStamp } from "console";

export function formatTimestamp(timestamp: string | undefined) {
  if (timestamp) {
    const date = new Date(timestamp); // Create a Date object

    // Extract the date components
    const day = String(date.getUTCDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Get month (0-indexed)
    const year = date.getUTCFullYear(); // Get year

    // Extract the time components
    const hours = date.getUTCHours(); // Get hours
    const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Get minutes and pad with zero if needed

    // Format as DD/MM/YYYY H:MM
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
