# 🔬 반도체 기술 허브 (v3 Final — Perplexity Pro + Gemini Pro)

## API 구성

### Perplexity Pro ($20/월 구독 중)
- API 크레딧: 월 $5 기본 제공 (추가 구매 가능)
- Sonar: $1/$1 per 1M tokens — 뉴스 요약, 일반 검색
- Sonar Pro: $3/$15 per 1M tokens — 논문/트렌드 딥리서치
- **핵심 용도: 웹 검색 내장 → 최신 논문/뉴스 자동 발굴 + 출처 URL 제공**

### Gemini Pro (유료 구독 중)
- Tier 1 이상: 1,000+ RPM, 4M+ TPM
- Gemini 2.5 Pro: 복잡한 분석/요약
- Gemini 2.5 Flash: 대량 처리, 채팅봇
- **핵심 용도: 뉴스 요약, 수치 추출, AI 채팅 (면접 코치), 콘텐츠 생성**

### 용도별 배분
| 기능 | API | 모델 | 빈도 |
|------|-----|------|------|
| 뉴스 수집+검색 | Perplexity | Sonar | 매일 2회 |
| 뉴스 요약+수치추출 | Gemini | 2.5 Flash | 매일 2회 |
| 논문/트렌드 딥리서치 | Perplexity | Sonar Pro | 주 2회 |
| 트렌드→학습방향 생성 | Gemini | 2.5 Pro | 주 2회 |
| AI 채팅 (면접코치) | Gemini | 2.5 Flash | 사용자 요청 시 |
| 콘텐츠 자동 생성 | Gemini | 2.5 Pro | 새 트렌드 발견 시 |

---

## 사이트 구조 (3개 섹션)

```
/ → 삼성 / 하이닉스 / 반도체 상식 선택

/samsung                 삼성 (하이닉스 비교 지표 포함)
/hynix                   하이닉스 (삼성 비교 지표 포함)  
/fundamentals            반도체 상식 + AI 면접 코치

각 섹션 하위:
  /[section]/process/[slug]    5대 공정 상세
  /[section]/tech/[slug]       기술 상세 + 인터랙티브
  /[section]/compare           양사 비교 대시보드
  /[section]/timeline          기술 발전 타임라인
  /[section]/news              자동 갱신 뉴스
  /fundamentals/ai-coach       AI 면접 코치 채팅
  /fundamentals/trends         자동 갱신 트렌드 브리핑
```

---

## 자동 갱신 시스템 (3중 파이프라인)

### 파이프라인 1: 뉴스 (매일 09:00, 18:00 KST)
```
[Perplexity Sonar] "삼성전자 반도체 최신 뉴스 오늘" → 기사 URL 목록
        ↓
[Gemini 2.5 Flash] 각 기사 → 3줄 요약 + 카테고리 + 중요도
        ↓
[Gemini 2.5 Flash] 각 기사 → 수치 추출 (핀속도/대역폭/수율 등)
        ↓
news.json + metrics.json 자동 갱신
```

### 파이프라인 2: 논문/트렌드 (매주 월/목)
```
[Perplexity Sonar Pro] "semiconductor [topic] latest research 2026"
        ↓
[Gemini 2.5 Pro] 트렌드 요약 + "왜 중요한지" + "어떻게 공부할지"
        ↓
trends.json 추가 (기존 것 유지, 새 것 append)
        ↓
/fundamentals/trends 페이지 자동 갱신
```

### 파이프라인 3: AI 면접 코치 (사용자 실시간)
```
[사용자] "High-K Metal Gate에 대해 설명해주세요"
        ↓
[시스템] fundamentals 콘텐츠 + trends.json + metrics.json RAG 참조
        ↓
[Gemini 2.5 Flash] 면접관 페르소나로 답변 + 피드백 + 학습방향
```

---

## 환경 변수

```env
# .env.local
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://semiconductor-site-nine.vercel.app
```

---

## 기술 스택

```
Next.js 14 (App Router) + TypeScript
Tailwind CSS + shadcn/ui
Framer Motion (애니메이션)
Three.js + React Three Fiber (3D 시각화)
Recharts (차트)
Vercel (배포 + Cron)
@google/generative-ai (Gemini SDK)
```

---

## 통합 지표 시스템

모든 메모리 라인업에 동일 카테고리 적용:
1. 핀속도 (Gbps)
2. 대역폭 (GB/s, TB/s)  
3. 용량 (GB)
4. 전력효율 (% 절감)
5. JEDEC 달성률
6. 양산시점
7. 핵심 차별 기술

라인업: **HBM / DDR5 / GDDR7 / LPDDR6 / NAND**

삼성 페이지 → 하이닉스 수치 회색 소글씨로 병기
하이닉스 페이지 → 삼성 수치 회색 소글씨로 병기

---

## 반도체 상식 (/fundamentals) 자동 갱신 구조

### 기존 콘텐츠 (영구 보존)
- MOSFET 변천사 (Planar → FinFET → GAA)
- High-K Metal Gate 상세
- 5대 공정 (Photo/Etch/Diffusion/Thin Film/CMP)
- 누설전류 종류와 솔루션
- 3D DRAM, 1T1C 셀
- SPC/FDC 품질 관리
- 데이터 4종류 (계측/설비/소자/수율)

### 자동 추가 콘텐츠 (트렌드 기반)
```
주 2회 Perplexity Sonar Pro 실행:
  → "semiconductor process technology latest trend 2026"
  → "HBM packaging latest research"
  → "advanced lithography EUV High-NA"
  → "3D DRAM CMOS under array"

Gemini 2.5 Pro가 다음 형식으로 변환:
  {
    title: "극저온 식각 기술의 최신 동향",
    date: "2026-03-28",
    summary: "3줄 요약",
    whyImportant: "왜 중요한지",
    howToStudy: "공부 방법/참고 자료",
    interviewTip: "면접에서 이렇게 답하세요",
    sources: ["url1", "url2"],
    relatedFundamentals: ["etch", "thin-film"]
  }

→ trends.json에 append (기존 것 삭제 안 함)
→ /fundamentals/trends 페이지에 최신순 표시
→ 관련 기존 콘텐츠에 "최신 트렌드" 배지 링크
```

---

## AI 면접 코치 시스템 프롬프트

```typescript
const INTERVIEW_COACH_SYSTEM = `
당신은 SK하이닉스/삼성전자 양산 기술 면접관 출신 선배입니다.
후배에게 면접 준비를 도와주는 역할입니다.

모드:
1. [면접 모드] - 질문을 던지고 답변을 평가
2. [트렌드 모드] - 최신 트렌드 설명 + 공부 방향 제시
3. [개념 모드] - 반도체 개념 질문에 면접 수준으로 답변

규칙:
- 한국어로 대화
- 답변 평가 시: 잘한 점 → 부족한 점 → 추가할 키워드 순서
- 트렌드 설명 시: 요약 → 왜 중요한지 → 어떻게 공부할지
- 면접 포인트는 반드시 "★" 표시
- 참고 데이터: technologies.json, trends.json, fundamentals 콘텐츠

톤: 선배가 카페에서 알려주는 느낌. 편하지만 정확하게.

예시:
사용자: "High-K Metal Gate에 대해 설명해주세요"
코치: "좋은 질문이야. 이건 면접에서 자주 나오는데..."
→ High-K와 Metal Gate를 각각 나눠 설명
→ ★ 포인트: "반드시 둘을 분리해서 답해야 해"
→ 관련 트렌드: "최근 GAA 수율 이슈 때문에 더 중요해짐"
`;
```

---

## 프로젝트 폴더 구조

```
semiconductor-tech-hub/
├── CLAUDE.md
├── package.json
├── pnpm-workspace.yaml
├── .env.local                    # API 키
├── vercel.json                   # Cron 설정
│
├── apps/web/                     # Next.js 앱 (단일 앱)
│   ├── CLAUDE.md                 # 앱 전용 컨텍스트
│   ├── next.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # 메인 (3섹션 선택)
│   │   │   ├── samsung/
│   │   │   │   ├── page.tsx                # 삼성 랜딩
│   │   │   │   ├── tech/[slug]/page.tsx
│   │   │   │   ├── compare/page.tsx
│   │   │   │   └── news/page.tsx
│   │   │   ├── hynix/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tech/[slug]/page.tsx
│   │   │   │   ├── hbm/page.tsx
│   │   │   │   ├── compare/page.tsx
│   │   │   │   └── news/page.tsx
│   │   │   ├── fundamentals/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── mosfet-evolution/page.tsx
│   │   │   │   ├── high-k-metal-gate/page.tsx
│   │   │   │   ├── process/[slug]/page.tsx
│   │   │   │   ├── trends/page.tsx         # 자동 갱신 트렌드
│   │   │   │   └── ai-coach/page.tsx       # AI 면접 코치
│   │   │   └── api/
│   │   │       ├── cron/
│   │   │       │   ├── fetch-news/route.ts
│   │   │       │   └── fetch-trends/route.ts
│   │   │       └── chat/route.ts           # AI 채팅 엔드포인트
│   │   ├── components/
│   │   │   ├── CompanyComparisonCard.tsx
│   │   │   ├── JEDECProgressBar.tsx
│   │   │   ├── GateStructureViewer.tsx
│   │   │   ├── DVFSSimulator.tsx
│   │   │   ├── HBMStackViewer.tsx
│   │   │   ├── TrendCard.tsx
│   │   │   ├── AIChatInterface.tsx
│   │   │   └── NewsCard.tsx
│   │   ├── lib/
│   │   │   ├── gemini.ts                   # Gemini API 래퍼
│   │   │   ├── perplexity.ts               # Perplexity API 래퍼
│   │   │   ├── glossary.ts
│   │   │   └── analogies.ts
│   │   └── data/
│   │       ├── samsung-tech.json
│   │       ├── hynix-tech.json
│   │       ├── metrics.json                # 통합 지표 (자동 갱신)
│   │       ├── news.json                   # 뉴스 (자동 갱신)
│   │       ├── trends.json                 # 트렌드 (자동 갱신)
│   │       ├── fundamentals.json           # 상식 콘텐츠
│   │       └── processes.json              # 5대 공정
│   └── public/
│
└── skills/                        # Claude Code 스킬
    ├── research-semiconductor/SKILL.md
    ├── tech-simplifier/SKILL.md
    ├── interactive-component/SKILL.md
    ├── news-curator/SKILL.md
    ├── fact-checker/SKILL.md
    ├── design-system/SKILL.md
    ├── deploy-automation/SKILL.md
    ├── comparison-dashboard/SKILL.md
    ├── fundamentals-writer/SKILL.md
    └── metrics-updater/SKILL.md
