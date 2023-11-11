import { signal } from "@preact/signals-react"

export const time = signal(new Date())

setInterval(() => {
	time.value = new Date()
}, 1000)
