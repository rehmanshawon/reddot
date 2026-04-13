export default function FilmCard({ item, onOpen, imageKey = "poster", meta = [] }) {
  const imageUrl = item[imageKey];

  return (
    <button type="button" className="film-card" onClick={() => onOpen(item)}>
      <div
        className="film-card__image"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,8,12,0.08), rgba(7,8,12,0.8)), url(${imageUrl})`,
        }}
      />
      <div className="film-card__body">
        <div className="chip-row">
          {meta.map((value) => (
            <span key={value} className="chip">
              {value}
            </span>
          ))}
        </div>
        <h3>{item.title}</h3>
        {item.client ? <p>{item.client}</p> : null}
        {item.production ? <p>{item.production}</p> : null}
        {item.description ? <p className="film-card__description">{item.description}</p> : null}
      </div>
    </button>
  );
}
