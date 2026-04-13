export default function ReelModal({ item, imageKey = "poster", onClose }) {
  if (!item) {
    return null;
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content">
        <button type="button" className="modal__close" onClick={onClose}>
          Close
        </button>
        <div className="modal__media">
          <iframe
            src={item.reelUrl}
            title={`${item.title} reel`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="modal__details">
          <div
            className="modal__poster"
            style={{ backgroundImage: `url(${item[imageKey]})` }}
          />
          <div>
            <h3>{item.title}</h3>
            <p>{item.description || item.platform || item.production}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
