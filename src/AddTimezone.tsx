import { useRef, use } from "react"
import { timezones, addTimezone } from "./state/timezones"
const timezonesPromise = import("./data/tz-ids.json").then(
	(module) => module.default,
)

export default function AddTimezone() {
	const formRef = useRef<HTMLFormElement>(null)
	const allTimezones: string[] = use(timezonesPromise)
	const filteredTimezones = allTimezones.filter(
		(tz) => !timezones.value.includes(tz),
	)

	return (
		<form
			ref={formRef}
			onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault()
				if (!event.currentTarget) return
				const formData = new FormData(event.currentTarget)
				const timezone = String(formData.get("timezone"))
				if (timezone && allTimezones.includes(timezone)) {
					addTimezone(timezone)
					event.currentTarget.reset()
				}
			}}
			className="flex gap-4 w-96"
		>
			<input
				list="timezones"
				name="timezone"
				type="search"
				placeholder="Add a timezone..."
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			/>
			<datalist id="timezones">
				{filteredTimezones.map((tz) => (
					<option key={tz} value={tz}>
						{tz}
					</option>
				))}
			</datalist>
			<button
				type="submit"
				className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow"
			>
				Add
			</button>
		</form>
	)
}
