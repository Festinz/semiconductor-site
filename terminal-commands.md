# 🖥️ 터미널 실행 가이드 (복붙용)

## 0단계: 프로젝트 세팅

```bash
# 폴더 생성 및 이동
mkdir -p ~/semiconductor-tech-hub
cd ~/semiconductor-tech-hub

# 4개 MD 파일 복사 (다운받은 위치에서)
# CLAUDE.md, samsung-CLAUDE.md, hynix-CLAUDE.md, skills-all-SKILL-md.md
# → 프로젝트 루트에 배치

# .env.local 생성
cat > .env.local << 'EOF'
PERPLEXITY_API_KEY=pplx-여기에_퍼플렉시티_API_키
GEMINI_API_KEY=AIzaSy여기에_제미나이_API_키
NEXT_PUBLIC_SITE_URL=https://semiconductor-site-nine.vercel.app
EOF

# Git 초기화
git init
echo "node_modules/\n.next/\n.env.local" > .gitignore
```

---

## 1단계: 프로젝트 초기화

```bash
claude
```

Claude Code 실행 후 아래 프롬프트 입력:

```
CLAUDE.md를 읽고 프로젝트를 초기화해줘.

요구사항:
- Next.js 14 App Router + TypeScript
- pnpm 사용
- Tailwind CSS + shadcn/ui 설치
- Framer Motion, Recharts, @google/generative-ai, three, @react-three/fiber 설치
- CLAUDE.md의 프로젝트 폴더 구조대로 디렉토리와 빈 파일 생성
- vercel.json에 Cron 설정 추가
- src/data/ 폴더에 빈 JSON 파일들 생성 (metrics.json, news.json, trends.json, fundamentals.json, processes.json, samsung-tech.json, hynix-tech.json)
- src/lib/gemini.ts와 src/lib/perplexity.ts를 skills-all-SKILL-md.md의 코드대로 생성
```

---

## 2단계: 기존 사이트 데이터 이전 + 지표 통일

```
현재 https://semiconductor-site-nine.vercel.app 에 배포된 기존 코드가 있어.
samsung-CLAUDE.md와 hynix-CLAUDE.md를 읽고,

1) samsung-tech.json과 hynix-tech.json에 모든 라인업 데이터를 넣어줘:
   HBM4, DDR5, GDDR7, LPDDR6, NAND — 각각 삼성/하이닉스 양사 수치 포함
   
2) metrics.json에 통합 지표 구조를 만들어줘:
   모든 라인업에 동일한 카테고리: pinSpeed, bandwidth, capacity, powerEfficiency, jedecTarget, actualAchieved, processNode
   회사별: samsung, hynix 각각의 수치

3) processes.json에 5대 공정 데이터를 넣어줘:
   Photo, Etch, Diffusion, Thin Film, CMP — 각각 비유, 기술설명, 핵심파라미터, 면접포인트

4) fundamentals.json에 반도체 상식 데이터를 넣어줘:
   MOSFET 변천사, High-K Metal Gate, 누설전류 종류/솔루션, 3D DRAM, SPC/FDC
```

---

## 3단계: 메인 페이지 + 삼성/하이닉스 랜딩 개선

```
메인 페이지(/)를 3개 섹션 선택 화면으로 만들어줘:
- 삼성전자 반도체 (블루 #1428A0)
- SK하이닉스 반도체 (레드 #E4002B)  
- 반도체 상식 (그린/뉴트럴)
Framer Motion으로 호버 효과와 입장 애니메이션.

삼성 랜딩(/samsung)과 하이닉스 랜딩(/hynix) 개선:
1) 기술 카드의 지표를 통일해줘 — 모든 카드에 핀속도/대역폭/용량/전력효율 동일 포맷
2) 각 기술 카드에 작은 회색 글씨로 경쟁사 수치 표시
3) JEDEC 달성률 프로그레스 바 추가
4) 카드 클릭 시 /[company]/tech/[slug] 상세 페이지로 라우팅
5) GDDR7 카드 추가 (하이닉스: 48GB 세계최초 하이라이트)
6) 뉴스 카드 클릭 시 원문 링크로 이동 (새 탭)
```

---

## 4단계: 양사 비교 대시보드

```
/samsung/compare와 /hynix/compare 페이지를 만들어줘.
metrics.json 데이터 기반.

1) 상단 탭: HBM / DDR5 / GDDR7 / LPDDR6 / NAND
2) 선택한 탭의 통합 지표를 Recharts 수평 바 차트로 양사 비교
   - 삼성: 블루 바 / 하이닉스: 레드 바
3) JEDEC 표준 기준선을 점선으로 표시
4) 각 수치 옆에 lastUpdated 날짜 표시
5) 모바일: 세로 스택, 데스크톱: 가로 비교
6) CompanyComparisonCard 컴포넌트로 재사용 가능하게
```

---

## 5단계: 기술 상세 페이지 + 인터랙티브

```
/samsung/tech/[slug]와 /hynix/tech/[slug] 동적 라우트를 만들어줘.
samsung-tech.json, hynix-tech.json에서 slug로 데이터 로드.

각 상세 페이지 구조:
1) 히어로: 기술명 + 한줄 요약 + 상태 배지(양산/개발/연구)
2) "쉽게 말하면..." 비유 섹션 (큰 글씨, 일러스트 아이콘)
3) 통합 지표 카드 (양사 비교 포함)
4) 기술 깊이 탐구 (접기/펼치기 아코디언)
5) 인터랙티브 요소 (기술별로 다름):
   - HBM → HBM 적층 구조 SVG 다이어그램 (세대별 토글)
   - DDR5 → High-K vs SiO₂ 유전율 비교 슬라이더
   - GDDR7 → GPU 위 GDDR 배치 SVG 다이어그램
   - LPDDR6 → DVFS 시뮬레이터 (게이밍/일반/절전 모드 전환 슬라이더)
6) 관련 뉴스 (news.json에서 category 매칭)
7) 출처 링크

일단 HBM4 상세 페이지부터 만들고, 나머지는 같은 패턴으로 확장.
```

---

## 6단계: 반도체 상식 섹션

```
/fundamentals 페이지를 만들어줘. 카드 그리드로:
- MOSFET 변천사
- High-K Metal Gate
- 5대 공정
- 누설전류와 솔루션
- 반도체 데이터 4종류 & SPC/FDC
- 최신 트렌드 (자동 갱신)
- AI 면접 코치

/fundamentals/mosfet-evolution:
Planar → FinFET → GAA(MBCFET) 3단계를 SVG로 시각화.
각 구조 클릭 시: 채널 제어 방향 하이라이트(1면→3면→4면), 특징 설명.
하단에 "면접 포인트" 박스.

/fundamentals/high-k-metal-gate:
High-K 물질(HfO₂)과 Metal Gate(TiN)를 각각 나눠서 설명.
유전율 슬라이더: SiO₂(3.9) → HfO₂(20) 조절 시 누설전류 변화 시각화.
"★ 면접 모범 답변" 박스: 둘을 분리해서 답하는 예시.

/fundamentals/process/[slug]:
5대 공정 각각 상세 페이지. processes.json 기반.
Photo: PR Positive/Negative 토글 인터랙티브
Etch: Wet/Dry 비교 애니메이션
각 페이지에 "면접 포인트" 박스.
```

---

## 7단계: AI 면접 코치

```
/fundamentals/ai-coach 페이지를 만들어줘.

1) 채팅 인터페이스 (AIChatInterface.tsx):
   - 메시지 입력 → /api/chat POST → 스트리밍 응답
   - skills-all-SKILL-md.md의 api/chat/route.ts 코드 참고
   
2) 모드 선택 버튼 3개:
   - 🎯 면접 모드: "면접 질문을 던져주세요"
   - 📰 트렌드 모드: "최신 트렌드 알려주세요"  
   - 📚 개념 모드: "개념을 설명해주세요"

3) 시스템 프롬프트는 skills-all-SKILL-md.md의 INTERVIEW_COACH_SYSTEM 사용

4) 사이드바에 추천 질문 목록:
   - "High-K Metal Gate에 대해 설명해주세요"
   - "HBM4와 HBM3E의 차이점은?"
   - "GAA 수율 문제와 해결 방안은?"
   - "DVFS 기술이 왜 중요한가요?"
   - "최근 반도체 트렌드를 요약해주세요"

5) Gemini 2.5 Flash API 사용 (환경변수: GEMINI_API_KEY)
```

---

## 8단계: 뉴스 자동 갱신 시스템

```
뉴스 자동 수집 + 요약 + 지표 갱신 파이프라인을 구현해줘.

1) /api/cron/fetch-news/route.ts:
   - skills-all-SKILL-md.md의 코드 참고
   - Perplexity Sonar로 삼성/하이닉스 반도체 뉴스 검색
   - Gemini 2.5 Flash로 3줄 요약 + 카테고리 + 수치 추출
   - news.json과 metrics.json 자동 갱신
   
2) /api/cron/fetch-trends/route.ts:
   - skills-all-SKILL-md.md의 코드 참고
   - Perplexity Sonar Pro로 논문/트렌드 검색
   - Gemini 2.5 Pro로 트렌드 브리핑 생성
   - trends.json에 append (기존 유지)

3) /samsung/news와 /hynix/news 페이지:
   - news.json에서 company 필터링
   - 속보: 빨간 배지 + 맨 위
   - 카드 클릭 → 원문 링크 (새 탭)
   - 무한 스크롤

4) /fundamentals/trends 페이지:
   - trends.json 최신순 표시
   - 각 트렌드 카드: 제목, 요약, 왜 중요한지, 공부 방법, ★면접 팁
   - 난이도 배지 (초급/중급/고급)
   - 관련 기본 개념 링크

5) vercel.json Cron 확인
```

---

## 9단계: 배포

```
Vercel에 배포해줘.

1) pnpm build 실행하고 에러 수정
2) vercel.json의 Cron 설정 확인
3) 환경변수 설정:
   - PERPLEXITY_API_KEY
   - GEMINI_API_KEY  
   - NEXT_PUBLIC_SITE_URL
4) vercel --prod 배포
5) Cron Job 테스트: /api/cron/fetch-news 수동 호출해서 동작 확인
6) AI 채팅 테스트: /fundamentals/ai-coach에서 질문 보내기 테스트
```

---

## 10단계: 최종 점검

```
전체 사이트를 점검해줘:

1) 모든 페이지 라우팅 동작 확인
2) 모바일 반응형 (360px) 확인  
3) 양사 비교 지표가 모든 카드에 표시되는지 확인
4) 뉴스 원문 링크 동작 확인
5) AI 채팅 응답 정상 확인
6) Cron Job 로그 확인
7) "자료 제공: 권순찬" 크레딧이 반도체 상식 섹션에 있는지 확인
8) Core Web Vitals: LCP < 2.5s 목표
```

---

## 이후 유지보수 명령어

```bash
# 뉴스 수동 갱신 (Cron 외 즉시 실행)
curl https://your-site.vercel.app/api/cron/fetch-news

# 트렌드 수동 갱신
curl https://your-site.vercel.app/api/cron/fetch-trends

# 새 기술 페이지 추가
claude "samsung-tech.json에 [기술명] 데이터 추가하고 상세 페이지 만들어줘"

# 순찬형 피드백 반영
claude "[피드백 내용]을 반영해서 [페이지]를 수정해줘"

# 새 반도체 상식 토픽 추가
claude "fundamentals.json에 [토픽] 추가하고 /fundamentals/[slug] 페이지 만들어줘"
```

---

## API 비용 예상 (월)

| 항목 | API | 호출수 | 예상 비용 |
|------|-----|--------|----------|
| 뉴스 검색 | Perplexity Sonar | 60회/월 | ~$0.5 |
| 뉴스 요약 | Gemini Flash | 300회/월 | 유료구독내 |
| 트렌드 리서치 | Perplexity Sonar Pro | 8회/월 | ~$1-2 |
| 트렌드 브리핑 | Gemini Pro | 24회/월 | 유료구독내 |
| AI 채팅 | Gemini Flash | 사용량따라 | 유료구독내 |
| **합계** | | | **~$2-3/월** (Perplexity API만) |

Gemini Pro 구독으로 대부분 커버, Perplexity는 월 $5 기본 크레딧 내에서 충분.
