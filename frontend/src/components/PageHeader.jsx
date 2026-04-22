export default function PageHeader({ title, description, aside }) {
  return (
    <div className="flex justify-between gap-4 items-end mb-6 flex-wrap">
      <div>
        <span className="inline-block mb-2 text-brand-muted text-[0.78rem] tracking-[0.12em] uppercase">FashionStore Collection</span>
        <h2 className="m-0 text-3xl font-bold">{title}</h2>
        {description ? <p className="mt-2 mb-0 text-brand-muted">{description}</p> : null}
      </div>
      {aside && <div className="flex gap-2 items-center flex-wrap">{aside}</div>}
    </div>
  );
}
