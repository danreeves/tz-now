import { timezones } from "./state/timezones"
import SortableList, { SortableItem } from "react-easy-sort"
import { arrayMoveImmutable } from "array-move"
import { Timezone } from "./Timezone"

function onSortEnd(oldIndex: number, newIndex: number) {
	timezones.value = arrayMoveImmutable(timezones.value, oldIndex, newIndex)
}

export default function Timezones() {
	return (
		<SortableList
			onSortEnd={onSortEnd}
			className="flex flex-col gap-2"
			draggedItemClassName="dragged"
			lockAxis="y"
		>
			{timezones.value.map((tz) => (
				<SortableItem key={tz}>
					<Timezone tz={tz} />
				</SortableItem>
			))}
		</SortableList>
	)
}
