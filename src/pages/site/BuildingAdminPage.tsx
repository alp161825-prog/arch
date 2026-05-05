import { useEffect, useMemo, useState } from "react";
import {
  createBuildingRecord,
  deleteBuildingRecord,
  fetchBuildings,
  updateBuildingRecord,
  type BuildingRecord,
} from "@/lib/buildingsApi";

type TopicValue = "residential" | "government" | "palace" | "bridge";

type BuildingForm = {
  id: string;
  label: string;
  longitude: string;
  latitude: string;
  regionId: string;
  dynasty: string;
  topic: TopicValue;
  provinceCode: string;
  location: string;
  summary: string;
  image: string;
  source: string;
};

const topicOptions: Array<{ value: TopicValue; label: string }> = [
  { value: "residential", label: "姘戝眳" },
  { value: "government", label: "瀹樼讲" },
  { value: "palace", label: "鐨囧" },
  { value: "bridge", label: "妗ユ" },
];

const emptyForm: BuildingForm = {
  id: "",
  label: "",
  longitude: "",
  latitude: "",
  regionId: "",
  dynasty: "",
  topic: "palace",
  provinceCode: "",
  location: "",
  summary: "",
  image: "",
  source: "manual",
};

const toForm = (item: BuildingRecord): BuildingForm => ({
  id: item.id,
  label: item.label,
  longitude: String(item.longitude),
  latitude: String(item.latitude),
  regionId: item.regionId,
  dynasty: item.dynasty,
  topic: (item.topic as TopicValue) || "palace",
  provinceCode: item.provinceCode,
  location: item.location,
  summary: item.summary,
  image: item.image || "",
  source: item.source || "manual",
});

const BuildingAdminPage = () => {
  const [items, setItems] = useState<BuildingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [topicFilter, setTopicFilter] = useState<"all" | TopicValue>("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState<BuildingForm>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBuildings({
        q: keyword.trim() || undefined,
        topic: topicFilter === "all" ? undefined : topicFilter,
        limit: 2000,
      });
      setItems(data);
      if (!selectedId && data[0]?.id) {
        setSelectedId(data[0].id);
        setForm(toForm(data[0]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 260);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, topicFilter]);

  const selectedItem = useMemo(
    () => items.find(item => item.id === selectedId),
    [items, selectedId],
  );

  useEffect(() => {
    if (!selectedItem) return;
    setForm(toForm(selectedItem));
  }, [selectedItem]);

  const onCreateNew = () => {
    setSelectedId("");
    setForm(emptyForm);
  };

  const onSave = async () => {
    const payload = {
      id: form.id.trim(),
      label: form.label.trim(),
      longitude: Number(form.longitude),
      latitude: Number(form.latitude),
      regionId: form.regionId.trim(),
      dynasty: form.dynasty.trim(),
      topic: form.topic,
      heat: 0,
      provinceCode: form.provinceCode.trim(),
      location: form.location.trim(),
      summary: form.summary.trim(),
      image: form.image.trim(),
      source: form.source.trim() || "manual",
    };

    if (!payload.id || !payload.label || Number.isNaN(payload.longitude) || Number.isNaN(payload.latitude)) {
      setError("璇疯嚦灏戝～鍐欙細ID銆佸悕绉般€佺粡绾害銆?);
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (selectedId) {
        await updateBuildingRecord(selectedId, payload);
      } else {
        await createBuildingRecord(payload);
      }
      await load();
      setSelectedId(payload.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!selectedId) return;
    const ok = window.confirm(`纭鍒犻櫎锛?{selectedId} ?`);
    if (!ok) return;
    setSaving(true);
    setError("");
    try {
      await deleteBuildingRecord(selectedId);
      setSelectedId("");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[34px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-6 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
        <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">BUILDING ADMIN</p>
        <h1 className="mt-2 text-3xl font-serif-cn font-bold">寤虹瓚鏁版嵁绠＄悊</h1>
        <p className="mt-3 text-sm leading-7 text-foreground/72">
          杩欓噷鐩存帴绠＄悊鏁版嵁搴撲腑鐨勫缓绛戞潯鐩紝淇濆瓨鍚庡墠鍙伴〉闈細鎸夋柊鏁版嵁灞曠ず銆?        </p>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-5 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_120px_120px]">
            <input
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder="鎼滅储 ID / 鍚嶇О / 鍦扮偣 / 绠€浠?
              className="rounded-[16px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-4 py-3 text-sm outline-none"
            />
            <select
              value={topicFilter}
              onChange={event => setTopicFilter(event.target.value as "all" | TopicValue)}
              className="rounded-[16px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-3 text-sm outline-none"
            >
              <option value="all">鍏ㄩ儴涓撻</option>
              {topicOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={onCreateNew}
              className="rounded-[16px] border border-[rgba(129,90,53,0.16)] bg-white/90 px-3 py-3 text-sm text-foreground/82"
            >
              鏂板缓鏉＄洰
            </button>
            <button
              onClick={() => void load()}
              className="rounded-[16px] border border-[rgba(129,90,53,0.16)] bg-white/90 px-3 py-3 text-sm text-foreground/82"
            >
              鍒锋柊
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(129,90,53,0.12)] text-left text-muted-foreground">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">鍚嶇О</th>
                  <th className="px-3 py-2">涓撻</th>
                  <th className="px-3 py-2">鏈濅唬</th>
                  <th className="px-3 py-2">鐪佷唤</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer border-b border-[rgba(129,90,53,0.08)] ${
                      selectedId === item.id ? "bg-[rgba(129,90,53,0.08)]" : "hover:bg-[rgba(129,90,53,0.04)]"
                    }`}
                  >
                    <td className="px-3 py-2">{item.id}</td>
                    <td className="px-3 py-2">{item.label}</td>
                    <td className="px-3 py-2">{item.topic}</td>
                    <td className="px-3 py-2">{item.dynasty}</td>
                    <td className="px-3 py-2">{item.provinceCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? <p className="mt-3 text-xs text-muted-foreground">鍔犺浇涓€?/p> : null}
          {!loading && items.length === 0 ? <p className="mt-3 text-xs text-muted-foreground">娌℃湁鍖归厤鏁版嵁銆?/p> : null}
        </article>

        <article className="rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[rgba(255,251,245,0.9)] p-5 shadow-[0_18px_34px_rgba(122,86,52,0.08)]">
          <h2 className="text-2xl font-serif-cn font-bold">{selectedId ? "缂栬緫鏉＄洰" : "鏂板鏉＄洰"}</h2>
          <div className="mt-4 grid gap-3">
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="id锛堝敮涓€锛? className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
            <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="寤虹瓚鍚嶇О" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="缁忓害" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
              <input value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="绾害" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.regionId} onChange={e => setForm({ ...form, regionId: e.target.value })} placeholder="regionId" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
              <input value={form.dynasty} onChange={e => setForm({ ...form, dynasty: e.target.value })} placeholder="鏈濅唬" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
            </div>
            <select value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value as TopicValue })} className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none">
              {topicOptions.map(option => (
                <option key={option.value} value={option.value}>{option.value}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.provinceCode} onChange={e => setForm({ ...form, provinceCode: e.target.value })} placeholder="鐪佷唤浠ｇ爜" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
              <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="source" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
            </div>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="鍦扮偣锛堝锛氬寳浜級" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="image path" className="rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
            <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="绠€浠? className="min-h-[120px] rounded-[14px] border border-[rgba(129,90,53,0.14)] bg-white/90 px-3 py-2.5 text-sm outline-none" />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => void onSave()}
              disabled={saving}
              className="rounded-full bg-[hsl(21,54%,38%)] px-5 py-2.5 text-sm text-white disabled:opacity-60"
            >
              {saving ? "淇濆瓨涓€? : "淇濆瓨"}
            </button>
            {selectedId ? (
              <button
                onClick={() => void onDelete()}
                disabled={saving}
                className="rounded-full border border-[rgba(173,84,60,0.3)] bg-[rgba(173,84,60,0.1)] px-5 py-2.5 text-sm text-[hsl(10,55%,36%)] disabled:opacity-60"
              >
                鍒犻櫎
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-[14px] border border-[rgba(173,84,60,0.3)] bg-[rgba(173,84,60,0.1)] px-3 py-2 text-sm text-[hsl(10,55%,36%)]">
              {error}
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
};

export default BuildingAdminPage;

