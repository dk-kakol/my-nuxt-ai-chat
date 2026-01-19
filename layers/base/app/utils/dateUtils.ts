import type { Chat } from "../../../chat/app/types";

/**
 * Checks if a given date falls within a specified number of days from now.
 *
 * @param date - The date to check
 * @param days - The number of days to look back from the current date
 * @returns `true` if the date is within the specified number of days, `false` otherwise
 *
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * isWithinDays(yesterday, 7); // returns true
 *
 * const lastMonth = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
 * isWithinDays(lastMonth, 7); // returns false
 * ```
 */
export function isWithinDays(date: Date, days: number): boolean {
	const now = new Date();
	const timeAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
	return date >= timeAgo;
}

/**
 * Filters chats based on a date range relative to the current date.
 *
 * @param {Chat[]} chats - Array of chat objects to filter
 * @param {number} startDays - Number of days from today for the start of the range (exclusive)
 * @param {number} [endDays] - Number of days from today for the end of the range (inclusive).
 *                             If undefined, returns chats older than startDays
 * @returns {Chat[]} Filtered and sorted array of chats in descending order by updatedAt date
 *
 * @example
 * // Get chats older than 30 days
 * filterChatsByDateRange(chats, 30);
 *
 * @example
 * // Get chats between 7 and 30 days old
 * filterChatsByDateRange(chats, 7, 30);
 */
export function filterChatsByDateRange(
	chats: Chat[],
	startDays: number,
	endDays?: number
) {
	return chats
		.filter((chat) => {
			const date = new Date(chat.updatedAt);
			if (endDays === undefined) {
				// For older chats (e.g., older than 30 days)
				return !isWithinDays(date, startDays);
			}
			// For date ranges (e.g., between 1-7 days)
			return !isWithinDays(date, startDays) && isWithinDays(date, endDays);
		})
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);
}
