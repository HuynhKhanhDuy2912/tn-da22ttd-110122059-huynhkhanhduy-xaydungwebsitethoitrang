export default function PageHeader({ title, description, aside }) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">FashionStore Collection</span>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {aside}
    </div>
  );
}
