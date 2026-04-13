export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="section-header">
      {eyebrow ? <p className="section-header__eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {text ? <p className="section-header__text">{text}</p> : null}
    </div>
  );
}
