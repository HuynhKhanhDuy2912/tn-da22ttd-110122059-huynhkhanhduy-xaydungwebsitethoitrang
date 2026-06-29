import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { apiRequest } from "../lib/api.js";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/collections?limit=50&isActive=true");
        setCollections(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
          <p className="text-sm text-gray-500">Đang tải bộ sưu tập...</p>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-8">
      <header className="mb-8 border border-gray-200 bg-white px-6 py-6 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
              FashionStore Editorial
            </p>
            <h1 className="m-0 text-3xl font-extrabold uppercase tracking-wide text-black md:text-5xl">
              Bộ sưu tập
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-500">
            Khám phá các câu chuyện thời trang được tuyển chọn theo mùa, phong cách và tinh thần riêng của từng bộ sưu tập. <br />
          </p>
        </div>
      </header>

      {collections.length === 0 ? (
        <div className="border border-gray-200 py-20 text-center">
          <p className="m-0 text-sm text-gray-400">Chưa có bộ sưu tập nào</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection._id}
              to={`/collections/${collection.slug || collection._id}`}
              className="group grid min-h-[380px] overflow-hidden border border-gray-200 bg-white transition-colors hover:border-black md:grid-cols-[1.25fr_0.75fr]"
            >
              <div className="relative min-h-[320px] overflow-hidden bg-gray-100 md:min-h-[420px]">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-gray-300">
                    <ImageOff className="h-10 w-10" strokeWidth={1.4} />
                  </div>
                )}
                <div className="absolute left-5 top-5 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black">
                  Bộ sưu tập {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    {collection.products?.length || 0} sản phẩm
                  </p>
                  <h2 className="mb-4 text-3xl font-extrabold uppercase leading-tight tracking-wide text-black md:text-5xl">
                    {collection.name}
                  </h2>
                  {collection.description ? (
                    <p className="line-clamp-4 text-sm leading-7 text-gray-500">
                      {collection.description}
                    </p>
                  ) : null}
                </div>
                <span className="mt-8 inline-flex w-fit items-center gap-2 border-b border-black pb-1 text-xs font-bold uppercase tracking-widest text-black">
                  Xem bộ sưu tập
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
