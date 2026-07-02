type PrimaryButtonProps = {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function PrimaryButton({
  title,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        bg-[#476973]
        py-3
        text-lg
        font-semibold
        text-white
        transition
        hover:opacity-90
        active:scale-95
      "
    >
      {title}
    </button>
  );
}