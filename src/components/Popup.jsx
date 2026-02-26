function Popup({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup ${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default Popup;