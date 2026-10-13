interface EpicThumbnailProps {
  date: string;
  selected: boolean;
  onClick: () => void;
}

function EpicThumbnail({ date, selected, onClick }: EpicThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn p-1 flex-shrink-0 ${
        selected ? "border-primary border-3" : "border-secondary"
      }`}
      aria-pressed={selected}
      style={{ width: "110px" }}
    >
      <div
        className="position-relative rounded overflow-hidden bg-body-secondary"
        style={{ height: "50px" }}
      >
        <span className="d-block small mt-1 text-body">{date}</span>
      </div>
    </button>
  );
}

export default EpicThumbnail;
