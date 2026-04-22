export default function AdminPageHeader({ title, description, aside }) {
  return (
    <div className="bg-white p-7 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 flex justify-between gap-4 items-center mb-6">
      <div>
        <span className="inline-block mb-1.5 text-slate-400 text-xs tracking-widest uppercase font-medium">Khu vực quản trị</span>
        <h2 className="text-[1.8rem] text-slate-900 m-0 font-bold leading-tight">{title}</h2>
        {description ? <p className="text-slate-500 m-0 mt-2 text-[0.95rem]">{description}</p> : null}
      </div>
      {aside && <div className="flex gap-2 items-center flex-wrap">{aside}</div>}
    </div>
  );
}
