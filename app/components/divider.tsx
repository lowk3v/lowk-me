export const Divider = ({
	text = "",
}) => {
	return (
		<div className="relative flex py-0 items-center w-full h-px bg-zinc-800">
			<div className="flex-grow"></div>
			<span className="flex-shrink mx-4 text-zinc-400">{text}</span>
			<div className="flex-grow"></div>
		</div>
	);
}