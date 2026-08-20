import Button from "./Button";

function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  message = "There is nothing to display.",
  buttonText,
  onButtonClick
}) {
  return (
    <div className="empty-state">

      <div className="empty-state-icon">
        {icon}
      </div>

      <h2>{title}</h2>

      <p>{message}</p>

      {buttonText && (
        <Button
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}

    </div>
  );
}

export default EmptyState;