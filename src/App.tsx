import { Suspense } from "react"
import { Loader } from "lucide-react"
import AddTimezone from "./AddTimezone"
import Timezones from "./Timezones"

function App() {
	return (
		<div className="max-w-7xl w-full mx-auto">
			<h1 className="text-2xl p-2 font-black">What time is it there?</h1>
			<Suspense
				fallback={
					<div className="p-4 h-20 flex justify-center items-center text-indigo-200">
						<Loader className="animate-spin" />
					</div>
				}
			>
				<div className="p-4 h-20 w-full flex justify-center">
					<AddTimezone />
				</div>
			</Suspense>

			<Timezones />
			<footer className="text-center w-full p-4 text-gray-400 text-xs">
				Made by{" "}
				<a className="underline text-indigo-400" href="https://danreev.es">
					Dan
				</a>
			</footer>
		</div>
	)
}

export default App
