export default function PageHeader({ title, description, aside }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 pb-4 border-b border-gray-200">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black uppercase tracking-wider m-0">{title}</h2>
        {description && <p className="text-gray-500 mt-2 mb-0 text-sm max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {aside && <div>{aside}</div>}
    </div>
  );
}
