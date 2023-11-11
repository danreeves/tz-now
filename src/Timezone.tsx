import { forwardRef } from "react"
import { removeTimezone } from "./state/timezones"
import { computed } from "@preact/signals-react"
import { time } from "./state/time"
import { Trash2, GripVertical } from "lucide-react"
import { signal } from "@preact/signals-react"

const hoveredColumn = signal<null | number>(null)

const HOURS_BEFORE = 2
const HOURS_AFTER = 23

const surroundingHours = computed(() => {
	const hoursBefore = Array.from({ length: HOURS_BEFORE })
		.map((_, i) => {
			const copy = new Date(time.value.getTime())
			copy.setHours(copy.getHours() - (i + 1))
			return copy
		})
		.reverse()
	const hoursAfter = Array.from({ length: HOURS_AFTER }).map((_, i) => {
		const copy = new Date(time.value.getTime())
		copy.setHours(copy.getHours() + (i + 1))
		return copy
	})
	return [...hoursBefore, time.value, ...hoursAfter]
})

export const Timezone = forwardRef(_Timezone)

function _Timezone({ tz }: { tz: string }, ref: React.Ref<HTMLDivElement>) {
	const strings = computed(() => {
		return surroundingHours.value.map((date) => {
			const tzDate = new Date(
				date.toLocaleString("en-US", {
					timeZone: tz,
				}),
			)
			if (tzDate.getHours() === 0) {
				return date
					.toLocaleDateString(navigator.language || "en-US", {
						timeZone: tz,
						weekday: "short",
						day: "numeric",
					})
					.replace(" ", "\n")
			}
			return date
				.toLocaleTimeString(navigator.language || "en-US", {
					timeZone: tz,
					hour: "numeric",
					hourCycle: "h12",
				})
				.replace(" ", "\n")
		})
	})

	return (
		<div ref={ref}>
			<div className="text-sm pl-1 w-full flex place-content-between">
				<span className="font-bold">{tz}</span>{" "}
				<span className="text-gray-400 text-xs font-mono">
					{time.value.toLocaleDateString(navigator.language || "en-US", {
						dateStyle: "full",
						timeZone: tz,
					})}
					{" – "}
					{time.value.toLocaleTimeString(navigator.language || "en-US", {
						timeStyle: "full",
						timeZone: tz,
					})}
				</span>
			</div>
			<div className="flex rounded border-2 bg-white border-indigo-100 hover:border-indigo-300 hover:shadow h-14 select-none items-center group relative">
				<button
					onClick={() => removeTimezone(tz)}
					className="p-2 opacity-0 group-hover:opacity-100 left-[-2em] absolute"
				>
					<Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
				</button>
				<GripVertical className="text-indigo-200" />
				<div className="flex w-full h-full items-center">
					{strings.value.map((text, i) => (
						<Cell text={text} key={tz + i} i={i} />
					))}
				</div>
			</div>
		</div>
	)
}

function Cell({ text, i }: { text: string; i: number }) {
	return (
		<div
			onMouseEnter={() => (hoveredColumn.value = i)}
			className={`flex-1 text-center h-full hover:bg-indigo-100 flex justify-center items-center ${
				hoveredColumn.value === i ? "bg-indigo-100" : ""
			}`}
		>
			<pre className="font-sans leading-none">{text}</pre>
		</div>
	)
}
