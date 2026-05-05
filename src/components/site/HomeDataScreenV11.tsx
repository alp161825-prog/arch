import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ChinaGeoMapV8 from "@/components/site/ChinaGeoMapV8";
import { buildingOfficialSourcesV2 } from "@/data/buildingOfficialSourcesV2";
import { topicContents, type TopicKey } from "@/data/siteContentV2";
import { curatedTopicCopy } from "@/data/siteHomeCurated";
import { resolveUserBuildingImage } from "@/data/userBuildingImageMap";
import { useAtlasPoints } from "@/hooks/useAtlasPoints";

const HomeDataScreenV11 = () => {
  const navigate = useNavigate();
  const [focusedTopic, setFocusedTopic] = useState<TopicKey>("palace");
  const [selectedPointId, setSelectedPointId] = useState("forbidden-city");
  const { points: allPoints } = useAtlasPoints();

  const currentTopic = topicContents.find(topic => topic.key === focusedTopic)!;
  const currentTopicCopy = curatedTopicCopy[focusedTopic];
  const clickableProvinceIds = useMemo(
    () => Array.from(new Set(allPoints.map(point => point.provinceCode))),
    [allPoints],
  );

  const visiblePoints = useMemo(() => allPoints.filter(point => point.topic === focusedTopic), [allPoints, focusedTopic]);

  const selectedPoint =
    visiblePoints.find(point => point.id === selectedPointId) ??
    visiblePoints[0] ??
    visiblePoints[0];

  const selectedTopic = topicContents.find(item => item.key === selectedPoint?.topic) ?? currentTopic;
  const selectedExample =
    selectedTopic.examples.find(example => selectedPoint?.label && example.name.includes(selectedPoint.label.slice(0, 2))) ??
    selectedTopic.examples[0];
  const selectedDisplayImage = resolveUserBuildingImage(
    selectedPoint?.label ?? selectedExample?.name,
    selectedPoint?.image || selectedExample?.image || selectedTopic.heroImage,
  );
  const officialSources = selectedPoint ? buildingOfficialSourcesV2[selectedPoint.id] ?? [] : [];

  return (
    <section className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1.95fr)_340px]">
        <article className="flex h-full min-h-0 flex-col rounded-[30px] border border-[rgba(129,90,53,0.18)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98),rgba(240,229,208,0.96))] p-4 shadow-[0_20px_40px_rgba(120,83,49,0.12)]">
          <div className="mb-2 rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,248,0.62)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
            <h1 className="text-2xl font-serif-cn font-bold xl:text-[28px]">中国古代建筑地图主屏</h1>
          </div>

          <div className="mb-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {topicContents.map(topic => {
              const copy = curatedTopicCopy[topic.key];
              return (
                <button
                  key={topic.key}
                  onClick={() => {
                    setFocusedTopic(topic.key);
                    const firstPoint = allPoints.find(point => point.topic === topic.key);
                    if (firstPoint) setSelectedPointId(firstPoint.id);
                  }}
                  className={`flex min-h-[74px] w-full items-center justify-center rounded-[18px] border px-3 py-2.5 text-center transition-all ${
                    focusedTopic === topic.key
                      ? "border-transparent text-white shadow-[0_14px_26px_rgba(95,58,37,0.18)]"
                      : "border-[rgba(129,90,53,0.14)] bg-white/84 text-foreground hover:border-[rgba(129,90,53,0.26)]"
                  }`}
                  style={focusedTopic === topic.key ? { backgroundColor: topic.accent } : undefined}
                >
                  <p className="text-base font-serif-cn font-bold leading-tight xl:text-[18px]">{copy.title}</p>
                </button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden rounded-[26px] border border-[rgba(129,90,53,0.14)] bg-[rgba(255,252,246,0.94)] p-0 shadow-[0_16px_30px_rgba(120,83,49,0.1)]">
            <ChinaGeoMapV8
              className="h-full w-full"
              points={visiblePoints}
              activePointId={selectedPoint?.id}
              onPointSelect={setSelectedPointId}
              clickableProvinceIds={clickableProvinceIds}
              onProvinceSelect={province => {
                if (clickableProvinceIds.includes(province.id)) {
                  navigate(`/explore/province/${province.id}`);
                }
              }}
              accent={selectedTopic.accent}
              visibleTopics={[focusedTopic]}
            />
          </div>        </article>

        <aside className="h-full min-h-0">
          <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-[rgba(129,90,53,0.16)] bg-[linear-gradient(180deg,rgba(255,252,246,0.99),rgba(241,232,216,0.95))] shadow-[0_20px_40px_rgba(122,86,52,0.1)]">
            {selectedDisplayImage ? (
              selectedPoint ? (
                <Link
                  to={`/knowledge-base/${selectedPoint.id}`}
                  className="group block"
                  title={`查看${selectedPoint.label}详情`}
                >
                  <img
                    src={selectedDisplayImage}
                    alt={selectedPoint.label}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] xl:h-44"
                  />
                </Link>
              ) : (
                <img src={selectedDisplayImage} alt={selectedExample.name} className="h-40 w-full object-cover xl:h-44" />
              )
            ) : null}
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-[rgba(129,90,53,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.24em] text-[hsl(28,28%,48%)]">展陈说明牌</p>
                  <h2 className="mt-1.5 text-xl font-serif-cn font-bold">{selectedPoint?.label}</h2>
                </div>
              </div>
              <p className="mt-3 text-xs tracking-[0.18em] text-muted-foreground">
                {selectedPoint?.dynasty} / {selectedPoint?.location ?? selectedExample.location}
              </p>
              <div className="mt-3 rounded-[18px] border border-[rgba(129,90,53,0.1)] bg-white/64 px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                <p className="text-sm leading-6 text-foreground/76">{selectedPoint?.summary ?? selectedExample.summary}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  to={selectedTopic.route}
                  className="inline-flex items-center gap-2 rounded-full bg-[hsl(21,54%,38%)] px-4 py-2 text-sm text-white shadow-[0_10px_18px_rgba(95,58,37,0.14)]"
                >
                  进入当前专题
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="inline-flex items-center rounded-full border border-[rgba(129,90,53,0.12)] bg-white/68 px-3 py-2 text-xs text-muted-foreground">
                  {currentTopicCopy.shortTitle}
                </span>
              </div>

              {officialSources.length ? (
                <div className="mt-5 rounded-[22px] border border-[rgba(129,90,53,0.12)] bg-[rgba(113,76,45,0.05)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                  <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">官方来源</p>
                  <div className="mt-3 space-y-2.5">
                    {officialSources.map(source => (
                      <a
                        key={`${selectedPoint?.id}-${source.label}`}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-[16px] border border-[rgba(129,90,53,0.12)] bg-white/80 p-3 transition-all hover:translate-y-[-1px] hover:shadow-[0_10px_16px_rgba(120,83,49,0.08)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{source.label}</p>
                          <span className="rounded-full bg-[rgba(129,90,53,0.08)] px-2 py-1 text-[11px] text-foreground/72">{source.type}</span>
                        </div>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground">{source.note}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </article>
        </aside>
    </section>
  );
};

export default HomeDataScreenV11;
