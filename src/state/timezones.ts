import { signal, effect } from "@preact/signals-react"

function getFromLS(): string[] {
	const data = localStorage.getItem("timezones")
	try {
		const parsed = JSON.parse(data || "[]")
		if (Array.isArray(parsed)) {
			return Array.from(new Set(parsed))
		}
		return []
	} catch {
		return []
	}
}
export const timezones = signal<string[]>(getFromLS())

effect(() => {
	localStorage.setItem("timezones", JSON.stringify(timezones.value))
})

export function addTimezone(timezone: string) {
	const tzs = [...timezones.value, timezone]
	const unique = new Set(tzs)
	timezones.value = Array.from(unique)
}

export function removeTimezone(timezone: string) {
	const tzs = timezones.value.filter((tz) => tz !== timezone)
	timezones.value = tzs
}
