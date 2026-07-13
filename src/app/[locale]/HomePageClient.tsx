"use client";

import { Suspense, lazy } from "react";
import {
  Apple,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  Clock,
  Dumbbell,
  Gift,
  MoveVertical,
  Scale,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

// Tools Grid 卡片 → 对应 section 锚点（8 张卡与 8 个 section 一一对应）
const TOOLS_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "exercise-tier-list",
  "training-zones",
  "bulk-and-cut-guide",
  "food-and-supplements-guide",
  "calisthenics-progression-guide",
  "updates-and-patch-notes",
];

// Codes 模块 status 徽标配色
function toneBadge(status: string) {
  switch (status) {
    case "Current":
      return "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]";
    case "Redemption":
      return "bg-sky-500/10 border-sky-500/30 text-sky-400";
    case "Official Source":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    default:
      return "bg-white/5 border-border text-muted-foreground";
  }
}

// Exercise Tier List 字母徽标配色
const TIER_TONE: Record<string, string> = {
  S: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  A: "bg-sky-500/15 border-sky-500/40 text-sky-400",
  B: "bg-amber-500/15 border-amber-500/40 text-amber-400",
};

// Updates 模块 status 配色
function statusTone(status: string) {
  if (status === "Live")
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  return "bg-amber-500/10 border-amber-500/30 text-amber-400";
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ultimategymgame.wiki";
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Ultimate Gym Game Wiki",
        description:
          "Complete Ultimate Gym Game Wiki covering codes, exercises, muscle growth, training zones, nutrition, supplements, ranks, records, and progression tips for the Roblox bodybuilding simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Ultimate Gym Game - Realistic Bodybuilding Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Ultimate Gym Game Wiki",
        alternateName: "Ultimate Gym Game",
        url: siteUrl,
        description:
          "Complete Ultimate Gym Game Wiki resource hub for codes, exercises, training, nutrition, supplements, ranks, and progression guides on Roblox",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Ultimate Gym Game Wiki - Realistic Bodybuilding Simulator",
        },
        sameAs: [
          "https://www.roblox.com/games/87229519582692/Ultimate-Gym-Game",
          "https://www.roblox.com/communities/449589337",
          "https://www.youtube.com/watch?v=ptzFWDRtUsM",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Ultimate Gym Game",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Simulation", "Sports", "Fitness"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/87229519582692/Ultimate-Gym-Game",
        },
      },
      {
        "@type": "VideoObject",
        name: "Ultimate Gym Game Short Review",
        description:
          "Short review of Ultimate Gym Game, the Roblox realistic bodybuilding simulator covering 31+ exercises, strength/hypertrophy/endurance training zones, muscle growth, supplements and ranks.",
        uploadDate: "2025-01-01",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/ptzFWDRtUsM",
        url: "https://www.youtube.com/watch?v=ptzFWDRtUsM",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/87229519582692/Ultimate-Gym-Game"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，视口内自动播放 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="ptzFWDRtUsM"
              title="Ultimate Gym Game Short Review"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（导航项与下方 8 模块锚点一一对应） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOLS_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Gift className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.codes.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.codes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.codes.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.codes.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${toneBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  {item.code}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.reward}
                </p>
                <p className="text-sm">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.beginnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.beginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{step.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Exercise Tier List */}
      <section id="exercise-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Trophy className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.exerciseTierList.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.exerciseTierList.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.exerciseTierList.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.exerciseTierList.tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border font-bold text-lg ${TIER_TONE[tier.tier] || TIER_TONE.B}`}
                  >
                    {tier.tier}
                  </span>
                  <div>
                    <h3 className="font-bold">{tier.label}</h3>
                    <p className="text-xs text-muted-foreground">{tier.bestFor}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tier.exercises.map((ex: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{tier.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Training Zones */}
      <section id="training-zones" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Dumbbell className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.trainingZones.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.trainingZones.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.trainingZones.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border bg-white/5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Zone</th>
                  <th className="text-left p-4 font-semibold">Primary Goal</th>
                  <th className="text-left p-4 font-semibold">Training Focus</th>
                  <th className="text-left p-4 font-semibold">Recommended For</th>
                  <th className="text-left p-4 font-semibold">Progress Signal</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.trainingZones.zones.map((zone: any, index: number) => (
                  <tr key={index} className="border-b border-border align-top">
                    <td className="p-4 font-bold text-[hsl(var(--nav-theme-light))]">
                      {zone.zone}
                    </td>
                    <td className="p-4 text-sm">{zone.primaryGoal}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {zone.trainingFocus}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {zone.recommendedFor}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {zone.progressSignal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 移动端卡片 */}
          <div className="scroll-reveal md:hidden space-y-4">
            {t.modules.trainingZones.zones.map((zone: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl"
              >
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  {zone.zone}
                </h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold">Primary Goal</dt>
                    <dd className="text-muted-foreground">{zone.primaryGoal}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Training Focus</dt>
                    <dd className="text-muted-foreground">{zone.trainingFocus}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Recommended For</dt>
                    <dd className="text-muted-foreground">{zone.recommendedFor}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Exercises</dt>
                    <dd className="text-muted-foreground">{zone.exerciseExamples.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Progress Signal</dt>
                    <dd className="text-muted-foreground">{zone.progressSignal}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Bulk and Cut Guide */}
      <section id="bulk-and-cut-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Scale className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.bulkAndCutGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.bulkAndCutGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.bulkAndCutGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.bulkAndCutGuide.phases.map((phase: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="font-bold text-[hsl(var(--nav-theme-light))]">
                    {phase.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{phase.phase}</h3>
                <p className="text-sm text-muted-foreground mb-3">{phase.goal}</p>
                <ul className="space-y-1.5 mb-3">
                  {phase.actions.map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{action}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  {phase.checkpoint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Food and Supplements Guide */}
      <section id="food-and-supplements-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Apple className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.foodAndSupplementsGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.foodAndSupplementsGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.foodAndSupplementsGuide.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border bg-white/5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                  <th className="text-left p-3 font-semibold">Best Timing</th>
                  <th className="text-left p-3 font-semibold">Priority</th>
                  <th className="text-left p-3 font-semibold">Spending Advice</th>
                  <th className="text-left p-3 font-semibold">Avoid</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.foodAndSupplementsGuide.items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-border align-top">
                    <td className="p-3 font-bold text-[hsl(var(--nav-theme-light))]">
                      {item.type}
                    </td>
                    <td className="p-3 text-sm">{item.purpose}</td>
                    <td className="p-3 text-sm text-muted-foreground">{item.bestTiming}</td>
                    <td className="p-3 text-sm">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{item.spendingAdvice}</td>
                    <td className="p-3 text-sm text-muted-foreground">{item.avoid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 移动端卡片 */}
          <div className="scroll-reveal md:hidden space-y-4">
            {t.modules.foodAndSupplementsGuide.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl"
              >
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    {item.type}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {item.priority}
                  </span>
                </div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold">Purpose</dt>
                    <dd className="text-muted-foreground">{item.purpose}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Best Timing</dt>
                    <dd className="text-muted-foreground">{item.bestTiming}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Spending Advice</dt>
                    <dd className="text-muted-foreground">{item.spendingAdvice}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Avoid</dt>
                    <dd className="text-muted-foreground">{item.avoid}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Calisthenics Progression Guide */}
      <section id="calisthenics-progression-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <MoveVertical className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.calisthenicsProgressionGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.calisthenicsProgressionGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.calisthenicsProgressionGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal relative space-y-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6 md:pl-8">
            {t.modules.calisthenicsProgressionGuide.stages.map((stage: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.6rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-[hsl(var(--nav-theme))] md:-left-[2.1rem] md:h-9 md:w-9">
                  <span className="text-sm font-bold text-white">{stage.stage}</span>
                </div>
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <h3 className="font-bold text-lg mb-1">{stage.name}</h3>
                  <p className="mb-3 text-sm text-[hsl(var(--nav-theme-light))]">
                    {stage.exercise} · {stage.focus}
                  </p>
                  <ul className="mb-3 space-y-1.5">
                    {stage.trainingPlan.map((plan: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{plan}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-border pt-2 text-xs text-muted-foreground">
                    Milestone: {stage.milestone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Updates and Patch Notes */}
      <section id="updates-and-patch-notes" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Bell className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                {t.modules.updatesAndPatchNotes.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.updatesAndPatchNotes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.updatesAndPatchNotes.intro}
            </p>
          </div>
          <div className="scroll-reveal relative space-y-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6 md:pl-8">
            {t.modules.updatesAndPatchNotes.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] h-3 w-3 rounded-full border-2 border-background bg-[hsl(var(--nav-theme))]" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${statusTone(entry.status)}`}>
                      {entry.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {entry.date}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{entry.title}</h3>
                  <ul className="mb-2 space-y-1">
                    {entry.changes.map((change: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{change}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-border pt-2 text-sm">{entry.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/communities/449589337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=ptzFWDRtUsM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/87229519582692/Ultimate-Gym-Game"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
