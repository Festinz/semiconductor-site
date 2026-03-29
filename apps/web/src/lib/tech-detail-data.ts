// Shared data helpers for tech detail pages
import samsungData from "@/data/samsung-tech.json";
import hynixData from "@/data/hynix-tech.json";
import metricsData from "@/data/metrics.json";
import newsData from "@/data/news.json";

/* ---- slug ↔ key mapping ---- */

const SLUG_MAP: Record<string, string> = {
  hbm4: "HBM4",
  ddr5: "DDR5",
  gddr7: "GDDR7",
  lpddr6: "LPDDR6",
  nand: "NAND",
};

export function getLineupKey(slug: string) {
  return SLUG_MAP[slug.toLowerCase()] || null;
}

export function getLineup(company: "samsung" | "hynix", key: string) {
  const source = company === "samsung" ? samsungData : hynixData;
  return (source.lineups as any)[key] || null;
}

export function getMetrics(key: string) {
  return (metricsData as any)[key] || null;
}

/* ---- category-based news ---- */

const SLUG_CATEGORIES: Record<string, string[]> = {
  HBM4: ["hbm"],
  DDR5: ["memory"],
  GDDR7: ["memory"],
  LPDDR6: ["memory"],
  NAND: ["memory"],
};

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  importance: "breaking" | "major" | "normal";
  date?: string;
  sourceUrl?: string;
  company?: string;
}

export function getRelatedNews(key: string, company: string, limit = 4): NewsItem[] {
  const categories = SLUG_CATEGORIES[key] || [];
  return (newsData as NewsItem[])
    .filter(
      (n) =>
        categories.includes(n.category) &&
        (n.company === company || n.company === "both" || n.company === "industry")
    )
    .slice(0, limit);
}

/* ---- spec row builder ---- */

export interface SpecRow {
  label: string;
  value: string | null;
  competitorValue: string | null;
  unit: string;
}

export function buildSpecs(
  lineup: any,
  metricsCompany: any,
  metricsCompetitor: any
): SpecRow[] {
  const specs = lineup?.specs || {};
  return [
    {
      label: "핀속도",
      value: specs.pinSpeed?.value || null,
      competitorValue: metricsCompetitor?.pinSpeed ? `${metricsCompetitor.pinSpeed}` : null,
      unit: "Gbps",
    },
    {
      label: "대역폭",
      value: specs.bandwidth?.value || null,
      competitorValue: metricsCompetitor?.bandwidth ? `${metricsCompetitor.bandwidth}` : null,
      unit: "TB/s",
    },
    {
      label: "용량",
      value: specs.capacity?.value || null,
      competitorValue: metricsCompetitor?.capacity ? `${metricsCompetitor.capacity}` : null,
      unit: "GB",
    },
    {
      label: "전력효율",
      value: specs.powerEfficiency?.value || null,
      competitorValue: metricsCompetitor?.powerEfficiency ? `${metricsCompetitor.powerEfficiency}%↓` : null,
      unit: "",
    },
    {
      label: "공정 노드",
      value: specs.processNode || null,
      competitorValue: metricsCompetitor?.processNode || null,
      unit: "",
    },
  ];
}

export function getJedec(metricsCompany: any, jedecData: any) {
  if (!metricsCompany?.actualAchieved || !jedecData?.pinSpeed) return null;
  return {
    achieved: parseFloat(metricsCompany.actualAchieved),
    target: parseFloat(jedecData.pinSpeed),
    unit: "Gbps",
  };
}

/* ---- analogy data per slug ---- */

export interface AnalogyData {
  emoji: string;
  title: string;
  description: string;
}

const ANALOGIES: Record<string, AnalogyData> = {
  HBM4: {
    emoji: "🏗️",
    title: "초고층 아파트 단지",
    description:
      "일반 메모리(DDR)가 단층 주택이라면, HBM은 12층짜리 아파트를 수직으로 쌓아 올린 것입니다. 각 층(DRAM 다이)이 엘리베이터(TSV, 실리콘 관통 전극)로 연결되어, 같은 땅(면적)에서 수십 배 더 많은 데이터를 동시에 이동시킬 수 있습니다. AI GPU 옆에 이 아파트를 바로 붙여놓으면 — 그게 HBM입니다.",
  },
  DDR5: {
    emoji: "🚄",
    title: "KTX에서 SRT로 업그레이드",
    description:
      "DDR4가 KTX(300km/h)라면, DDR5는 SRT(350km/h)에 2차선 도로가 4차선으로 넓어진 것입니다. 같은 시간에 더 많은 데이터가 오갈 수 있고, High-K Metal Gate 기술로 전력 누수(누설전류)까지 대폭 줄였습니다.",
  },
  GDDR7: {
    emoji: "🎮",
    title: "GPU의 전용 고속도로",
    description:
      "HBM이 AI용 초고속 엘리베이터라면, GDDR7은 게이밍 GPU를 위한 전용 8차선 고속도로입니다. GPU 양쪽에 4개씩, 총 8개 칩이 붙어서 32Gbps로 데이터를 쏟아냅니다. 하이닉스는 여기서 칩당 48GB로 차선당 짐을 33% 더 실었습니다.",
  },
  LPDDR6: {
    emoji: "🔋",
    title: "에코 드라이브 자동차",
    description:
      "일반 메모리가 항상 풀 스로틀로 달리는 차라면, LPDDR6+DVFS는 상황에 따라 속도를 자동 조절하는 에코 드라이브 차입니다. 게이밍할 때만 최대 속도, 카톡할 때는 절전 모드 — 전력 20% 절감.",
  },
  NAND: {
    emoji: "📦",
    title: "초대형 창고",
    description:
      "DRAM이 작업대(빠르지만 작음)라면, NAND는 대형 창고(크지만 느림)입니다. SSD의 핵심 부품으로, 수백 층을 수직으로 쌓아(3D NAND) 용량을 극대화합니다.",
  },
};

export function getAnalogy(key: string): AnalogyData {
  return ANALOGIES[key] || { emoji: "💡", title: key, description: "" };
}

/* ---- deep dive accordion data ---- */

export interface DeepDiveItem {
  title: string;
  content: string;
}

const DEEP_DIVES: Record<string, (company: "samsung" | "hynix", lineup: any) => DeepDiveItem[]> = {
  HBM4: (company, lineup) => [
    {
      title: "TSV (Through Silicon Via) — 수직 연결의 핵심",
      content:
        "각 DRAM 다이를 수직으로 관통하는 구리 기둥입니다.\n\n• 지름: ~5μm, 깊이: ~50μm\n• 1개 HBM4에 수천 개의 TSV가 동시 데이터 전송\n• TSV 수가 많을수록 대역폭↑, but 수율 관리 난이도↑\n• HBM4에서는 2048bit 인터페이스 (HBM3E 대비 확장)",
    },
    {
      title: company === "samsung" ? "DTCO + IDM 통합 전략" : "MR-MUF (Mass Reflow Molded Underfill)",
      content:
        company === "samsung"
          ? "Design-Technology Co-Optimization의 약자.\n\n• 설계 단계부터 공정 최적화를 동시 진행\n• IDM(종합반도체)의 강점: 메모리 + 베이스다이(4nm) + 패키징을 한 회사에서 원스톱\n• 베이스다이를 자체 4nm 파운드리로 제조 → 경쟁사(TSMC 위탁) 대비 비용/소통 우위\n• HCB(Hybrid Copper Bonding)로 열저항 20%↓ → 16단+ 가능"
          : "Mass Reflow Molded Underfill의 약자.\n\n• 기존 MR(Mass Reflow) + TC-NCF 대비 열전도·신뢰성 우수\n• HBM3E에서 수율 80% 달성의 핵심 기술\n• TSV 접합 후 몰딩 과정에서 void(기포) 최소화\n• TSMC와 협력: 로직다이 + 패키징 MOU로 분업 체계 확립",
    },
    {
      title: "HBM4E — 차세대 로드맵",
      content:
        "• 핀속도: 16 Gbps (HBM4 대비 +37%)\n• 대역폭: 4.0 TB/s\n• 적층: 16-Hi 예상\n• GTC 2026에서 실물 최초 공개\n• 2027년부터 Custom HBM 시대 — 고객별 맞춤 사양 제공 예정",
    },
    {
      title: "발열 관리 — HBM의 최대 과제",
      content:
        "12단, 16단 적층 시 중심부 DRAM의 열이 빠져나가기 어려움.\n\n• HCB (Hybrid Copper Bonding): 범프 대신 구리 직접 접합 → 열 경로 단축\n• 실리콘 인터포저 내 열 확산 경로 최적화\n• 유리 기판: 유기 기판 대비 열전도율 우수 (SK하이닉스 개발 중)\n• 방열 솔루션이 HBM 세대 발전의 병목 — 구조 설계 혁신 필수",
    },
  ],
  DDR5: (company, lineup) => [
    {
      title: "High-K Metal Gate란?",
      content:
        "두 가지 다른 기술의 조합:\n\n1. High-K 유전체: SiO₂(유전율 3.9) → HfO₂(유전율 ~20)\n   → 물리적으로 두꺼운 막을 유지하면서 전기적으론 얇은 막과 동일\n   → 터널링 누설전류 대폭 감소\n\n2. Metal Gate: Poly-Si → TiN/TaN 금속\n   → Poly-Si의 공핍층(Depletion) 문제 해결\n   → Work Function 정밀 조절 가능\n\n★ 면접 포인트: 반드시 둘을 분리해서 답할 것!",
    },
    {
      title: "DVFS (Dynamic Voltage Frequency Scaling)",
      content:
        "부하에 따라 전압/주파수를 실시간 조절하는 기술.\n\n• 높은 부하: 전압↑ 주파수↑ → 최대 성능\n• 낮은 부하: 전압↓ 주파수↓ → 전력 절감\n• SK하이닉스 DDR5에 적용, 삼성은 High-K MG로 차별화\n• 전력 ∝ V² × f 이므로, 전압을 10% 낮추면 전력 ~19% 절감",
    },
    {
      title: "DDR5 vs DDR4 핵심 차이",
      content:
        "• 속도: 4.8~8.4+ Gbps (DDR4: 3.2 Gbps)\n• 채널: 듀얼 32bit 서브채널 (DDR4: 싱글 64bit)\n• 전압: 1.1V (DDR4: 1.2V)\n• ECC: On-die ECC 내장\n• 뱅크: 32 뱅크, 8 뱅크 그룹 (DDR4: 16/4)",
    },
  ],
  GDDR7: (company, lineup) => [
    {
      title: "GDDR7의 혁신 — PAM4 신호 방식",
      content:
        "• 기존 NRZ(0/1 두 레벨) → PAM4(4레벨: 00/01/10/11)\n• 같은 클럭에서 2배 데이터 전송\n• 단점: 신호 마진↓, 노이즈에 취약 → 고급 신호 처리 필요\n• GDDR7의 32Gbps 달성의 핵심 기술",
    },
    {
      title: "48GB 세계 최초 (하이닉스) — 어떻게 가능했나",
      content:
        "• 기존 GDDR 칩당 용량 한계를 깬 기술\n• 다이 사이즈 최적화 + 미세 공정 적용\n• GPU 양쪽 4개씩, 총 8개 → 384GB (48GB x 8)\n• 삼성 36GB x 8 = 288GB 대비 +33%\n• AI 추론/학습 워크로드에서 VRAM 용량이 곧 경쟁력",
    },
    {
      title: "HBM vs GDDR — 언제 무엇을 쓰는가",
      content:
        "• HBM: AI 학습/추론, 데이터센터 GPU (H100, B200)\n  → 대역폭 극한, but 비쌈 (칩당 ~$500)\n\n• GDDR: 게이밍, 엣지 AI, 소비자 GPU (RTX 50xx)\n  → 비용 효율적, 대역폭은 HBM보다 낮지만 충분\n\n• 트렌드: 고급 AI GPU는 HBM, 게이밍+엣지는 GDDR로 이원화",
    },
  ],
  LPDDR6: (company, lineup) => [
    {
      title: "DVFS가 왜 중요한가",
      content:
        "전력 소비 공식: P ∝ C × V² × f\n\n• 전압(V)을 20% 낮추면: 전력 36% 절감\n• 주파수(f)를 50% 낮추면: 전력 50% 절감\n• DVFS = 부하에 따라 V와 f를 동시 조절\n• 스마트폰 배터리 수명에 직결되는 핵심 기술",
    },
    {
      title: "서브채널 선택 운용",
      content:
        "• 전체 채널을 항상 사용하는 대신, 필요한 경로만 선택\n• 나머지 채널은 전원 차단 → 추가 절전\n• 가정용 로봇, AR 글래스 등 배터리 기기에 최적",
    },
    {
      title: "LPDDR6 vs LPDDR5X",
      content:
        "• 속도: 전세대 대비 +33%\n• 전력: DVFS 적용으로 20% 절감\n• 공정: 1c 10nm급\n• 타겟: 스마트폰, 가정용 로봇, On-device AI\n• 삼성: DVFS 미적용 / 하이닉스: DVFS 적용으로 차별화",
    },
  ],
  NAND: (company, lineup) => [
    {
      title: "3D NAND — 수직 적층의 시대",
      content:
        "• 2D NAND: 한 층에 셀 배치 → 미세화 한계\n• 3D NAND: 수백 층을 수직으로 쌓음 (200단+)\n• 적층 수↑ = 용량↑, but 공정 난이도 급증\n• HAR(고종횡비) 식각과 균일한 박막 증착이 핵심 과제",
    },
    {
      title: "PM9E1 — 삼성 차세대 SSD",
      content:
        "• GTC 2026에서 공개\n• AI 학습 데이터 전처리, 추론 캐싱에 최적화\n• PCIe Gen6 인터페이스 예상\n• 최신 V-NAND 기술 적용",
    },
  ],
};

export function getDeepDive(key: string, company: "samsung" | "hynix", lineup: any): DeepDiveItem[] {
  const fn = DEEP_DIVES[key];
  return fn ? fn(company, lineup) : [];
}

/* ---- one-liner per slug ---- */

const ONE_LINERS: Record<string, Record<"samsung" | "hynix", string>> = {
  HBM4: {
    samsung: "AI GPU 옆에 붙는 초고대역폭 메모리 — 삼성, 자체 4nm 베이스다이로 세계 최초 양산 출하",
    hynix: "AI GPU 옆에 붙는 초고대역폭 메모리 — HBM의 창시자 SK하이닉스, 부동의 점유율 1위",
  },
  DDR5: {
    samsung: "서버·PC의 주력 메모리 — 삼성, High-K Metal Gate로 누설전류 혁신",
    hynix: "서버·PC의 주력 메모리 — SK하이닉스, DVFS로 전력 효율 혁신",
  },
  GDDR7: {
    samsung: "게이밍 GPU를 위한 초고속 그래픽 메모리 — 32Gbps, 36GB/칩",
    hynix: "게이밍 GPU를 위한 초고속 그래픽 메모리 — 48GB/칩 세계 최초, HBM+GDDR 양쪽 독점",
  },
  LPDDR6: {
    samsung: "모바일·IoT를 위한 저전력 메모리 — 1c 10nm급 공정",
    hynix: "모바일·IoT를 위한 저전력 메모리 — DVFS로 전력 20%↓, 속도 33%↑",
  },
  NAND: {
    samsung: "SSD의 핵심 저장 칩 — PM9E1 차세대 SSD, GTC 2026 공개",
    hynix: "SSD의 핵심 저장 칩 — 3D NAND 고적층 경쟁 가속",
  },
};

export function getOneLiner(key: string, company: "samsung" | "hynix"): string {
  return ONE_LINERS[key]?.[company] || "";
}
