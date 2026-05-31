# 🥗 栄養管理アプリケーション — Project Requirements & Task Breakdown

> **Personal nutrition tracker** built with Next.js + Notion Database + Claude API  
> Goal: Track daily food intake, identify nutrient deficiencies, and receive AI-powered meal suggestions.

---

## 📌 Project Overview

| Item                   | Details                                                       |
| ---------------------- | ------------------------------------------------------------- |
| **Purpose**            | Track daily meals, calculate calories, identify nutrient gaps |
| **Target User**        | Individual use (no authentication required)                   |
| **Monthly Cost Limit** | **≤ $1.00 USD**                                               |
| **Input Granularity**  | Per ingredient (food item level)                              |

---

## 🛠 Tech Stack

| Layer              | Technology                                 |
| ------------------ | ------------------------------------------ |
| Frontend & Backend | Next.js (App Router, TypeScript)           |
| Database           | Notion Database (new — built from scratch) |
| AI                 | Claude API (prompt caching, minimal usage) |
| Hosting            | Vercel (free tier)                         |
| Styling            | Tailwind CSS                               |

---

## 🗃 Notion Database Schema

```
Food Log Database
├── 食材名 / Food Name       (Title)
├── 日付 / Date              (Date)
├── 時間帯 / Meal Time       (Select: 朝食 | 昼食 | 夕食 | 間食)
├── 量 / Amount              (Number — grams)
├── カロリー / Calories       (Number — kcal)
├── タンパク質 / Protein      (Number — g)
├── 脂質 / Fat               (Number — g)
├── 炭水化物 / Carbs          (Number — g)
├── ビタミンA / Vitamin A     (Number — μg)
├── ビタミンB群 / Vitamin B   (Number — mg)
├── ビタミンC / Vitamin C     (Number — mg)
├── ビタミンD / Vitamin D     (Number — μg)
├── ビタミンE / Vitamin E     (Number — mg)
├── カルシウム / Calcium      (Number — mg)
├── 鉄 / Iron                (Number — mg)
└── マグネシウム / Magnesium  (Number — mg)
```

---

## 🌍 Nutrition Data Source

- **Japanese Foods**: 文部科学省 日本食品標準成分表 (MEXT)
- **International Foods**: USDA FoodData Central
- Coverage: vitamins (A, B-group, C, D, E, K) + minerals (Ca, Fe, Mg, Zn, etc.)

---

## ✅ MVP Feature Requirements

### Core Features

| #   | Feature                   | Description                                                         |
| --- | ------------------------- | ------------------------------------------------------------------- |
| 1   | **Food Entry**            | Input ingredient name + amount (g) + meal time                      |
| 2   | **Nutrition Calculation** | Auto-calculate calories & nutrients from local food database        |
| 3   | **Notion Sync**           | Save each entry to Notion Calendar Database                         |
| 4   | **Daily Summary**         | Display today's total calories & nutrient breakdown                 |
| 5   | **Deficiency Detection**  | Compare intake vs. RDA, identify shortfalls                         |
| 6   | **AI Food Suggestions**   | Claude API suggests foods to cover nutrient gaps                    |
| 7   | **Personalization**       | User inputs body weight → daily calorie/nutrient targets calculated |

### Out of Scope (Post-MVP)

- Photo recognition of meals
- Voice input
- Recipe suggestions
- Social / sharing features
- Multi-user support
- Graphs & data visualization

---

## 💰 Cost Estimate

| Service    | Usage                                  | Cost/month          |
| ---------- | -------------------------------------- | ------------------- |
| Notion API | Read/write food logs                   | $0 (free tier)      |
| Claude API | ~30 requests/month with prompt caching | ~$0.30–$0.50        |
| Vercel     | Hosting                                | $0 (free tier)      |
| **Total**  |                                        | **~$0.50/month ✅** |

---

## 📁 Project Folder Structure

```
nutrition-app/
├── app/
│   ├── page.tsx                     # Main dashboard
│   ├── api/
│   │   ├── food/
│   │   │   └── add/route.ts         # Save food entry → Notion
│   │   ├── daily-summary/
│   │   │   └── route.ts             # Fetch today's Notion data
│   │   └── ai/
│   │       ├── suggest-foods/route.ts  # AI food suggestions
│   │       └── meal-plan/route.ts      # AI meal plan
├── components/
│   ├── FoodEntryForm.tsx            # Input form with autocomplete
│   ├── DailySummary.tsx             # Today's intake display
│   ├── DeficiencyDisplay.tsx        # Nutrient gap visualization
│   ├── FoodSuggestions.tsx          # AI-recommended foods
│   ├── MealPlanDisplay.tsx          # AI meal plan display
│   └── UserSettings.tsx            # Body weight input
├── lib/
│   ├── notion.ts                    # Notion client init
│   ├── nutrition.ts                 # Nutrition calculation logic
│   ├── deficiency.ts               # RDA comparison & gap detection
│   ├── claude.ts                   # Claude API wrapper
│   └── user.ts                     # Calorie goal calculation
├── data/
│   └── foods.json                  # Local food nutrition database
├── .env.local                      # API keys
└── README.md
```

---

## 🔑 Environment Variables

```env
NOTION_API_KEY=your_notion_integration_key
NOTION_DATABASE_ID=your_database_id
ANTHROPIC_API_KEY=your_claude_api_key
```

---

## 🗂 Task Breakdown — Implementation Order

---

### 🔵 Phase 1: Setup & Notion Integration

#### Task 1.1 — Next.js Project Setup

**Goal**: Initialize development environment

- [ ] Create Next.js app with TypeScript + Tailwind + App Router
- [ ] Set up folder structure
- [ ] Configure `.env.local`

```bash
npx create-next-app@latest nutrition-app --typescript --tailwind --app
```

**Deliverables**: Working Next.js project

---

#### Task 1.2 — Notion Database Creation & API Connection

**Goal**: Establish data persistence layer

- [ ] Create Notion integration token
- [ ] Build Notion database with all properties from schema above
- [ ] Install `@notionhq/client`
- [ ] Create `/lib/notion.ts` — Notion client init
- [ ] Create `/app/api/notion/test/route.ts` — connection test

**Validation**: Read & write to Notion database successfully

---

### 🟢 Phase 2: Nutrition Data Layer

#### Task 2.1 — Food Nutrition Database (JSON)

**Goal**: Local food data for instant, zero-cost lookups

- [ ] Compile nutrition data for 100+ common foods (JP + international)
- [ ] Standardize per 100g format
- [ ] Save as `/data/foods.json`

```typescript
interface FoodNutrition {
  name: string // Japanese name
  nameEn?: string // English name
  per100g: {
    calories: number // kcal
    protein: number // g
    fat: number // g
    carbs: number // g
    vitaminA?: number // μg
    vitaminC?: number // mg
    vitaminD?: number // μg
    calcium?: number // mg
    iron?: number // mg
    magnesium?: number // mg
    // ... other nutrients
  }
}
```

---

#### Task 2.2 — Nutrition Calculation Logic

**Goal**: Calculate nutrition values from food name + weight

- [ ] Create `/lib/nutrition.ts`
- [ ] Implement `searchFood(query: string)` — fuzzy search
- [ ] Implement `calculateNutrition(foodName: string, grams: number)` — returns nutrient values

---

### 🟡 Phase 3: Food Entry UI

#### Task 3.1 — Food Entry Form Component

**Goal**: Main input screen for users

- [ ] Create `/components/FoodEntryForm.tsx`
- [ ] Food name field with **autocomplete** from `foods.json`
- [ ] Amount field (grams, numeric)
- [ ] Meal time selector (朝食 / 昼食 / 夕食 / 間食)
- [ ] Submit button
- [ ] Mobile-friendly layout

---

#### Task 3.2 — Food Entry API Endpoint

**Goal**: Process form submission

- [ ] Create `/app/api/food/add/route.ts`
- [ ] Receive: food name, amount, meal time
- [ ] Calculate nutrition values
- [ ] Write to Notion database
- [ ] Return: success / error response

**Flow**:

```
User submits form
  → API receives data
  → Calculate nutrients
  → Save to Notion
  → Return result to UI
```

---

### 🟠 Phase 4: Nutrition Analysis & Display

#### Task 4.1 — Daily Summary Component

**Goal**: Show today's food log and totals

- [ ] Create `/app/api/daily-summary/route.ts` — fetch today from Notion
- [ ] Create `/components/DailySummary.tsx`
- [ ] Display: food list by meal time, total calories, macro breakdown
- [ ] Display: key vitamins & minerals

---

#### Task 4.2 — Nutrient Deficiency Logic

**Goal**: Identify which nutrients are lacking

- [ ] Create `/lib/deficiency.ts`
- [ ] Add RDA (Recommended Dietary Allowance) reference data by weight
- [ ] Implement `calculateDeficiencies(weight, dailyIntake)` function

```typescript
interface NutrientDeficiency {
  nutrient: string
  current: number
  recommended: number
  deficitPercentage: number // % of RDA achieved
  severity: "ok" | "low" | "critical"
}
```

---

#### Task 4.3 — Deficiency Display Component

**Goal**: Visual representation of nutrient gaps

- [ ] Create `/components/DeficiencyDisplay.tsx`
- [ ] Progress bars per nutrient (% of daily goal)
- [ ] Color coding: green / yellow / red
- [ ] List of deficient nutrients sorted by severity

---

### 🔴 Phase 5: AI-Powered Suggestions

#### Task 5.1 — Claude API Integration

**Goal**: Set up AI layer with cost controls

- [ ] Install `@anthropic-ai/sdk`
- [ ] Create `/lib/claude.ts`
- [ ] Implement **prompt caching** for system prompt
- [ ] Add usage logging for cost tracking

---

#### Task 5.2 — AI Food Suggestion Feature

**Goal**: Recommend foods to fill nutrient gaps

- [ ] Create `/app/api/ai/suggest-foods/route.ts`
- [ ] Build prompt with: deficient nutrients + user weight
- [ ] Parse Claude response → structured list
- [ ] Create `/components/FoodSuggestions.tsx`

**Example Prompt**:

```
あなたはプロの栄養士です。
以下の不足栄養素を補うために最適な食材を3〜5つ提案してください。
- 不足栄養素: ビタミンC (60%不足), 鉄 (40%不足)
- ユーザー体重: 65kg
入手しやすく、調理が簡単な食材を優先してください。
各食材について: 名前、補える栄養素、目安量を返してください。
```

---

#### Task 5.3 — AI Meal Plan Feature

**Goal**: Suggest a full day's meal example

- [ ] Create `/app/api/ai/meal-plan/route.ts`
- [ ] Generate breakfast / lunch / dinner suggestions
- [ ] Create `/components/MealPlanDisplay.tsx`

---

### 🟣 Phase 6: User Settings

#### Task 6.1 — Body Weight Input & Calorie Target

**Goal**: Personalize nutrition targets

- [ ] Create `/components/UserSettings.tsx`
- [ ] Body weight input field
- [ ] Save to **localStorage** (no auth needed)
- [ ] Create `/lib/user.ts`
- [ ] Implement `calculateDailyCalories(weight)` using standard formula

```typescript
// Base Metabolic Rate estimation (simplified)
function calculateDailyCalories(weightKg: number): number {
  // BMR × activity factor
  return weightKg * 28 // simplified estimate
}
```

---

### ⚪ Phase 7: Dashboard Integration

#### Task 7.1 — Main Dashboard Page

**Goal**: Bring all features together in one screen

- [ ] Update `/app/page.tsx`
- [ ] Layout: Food entry form + Daily summary + Deficiency panel + AI suggestions
- [ ] Responsive design (mobile first)
- [ ] Loading states & error handling

---

### ⚫ Phase 8: Testing & Deployment

#### Task 8.1 — QA Checklist

- [ ] Food entry → Notion save works correctly
- [ ] Nutrition calculations are accurate
- [ ] Deficiency detection shows correct nutrients
- [ ] AI suggestions are relevant and non-empty
- [ ] Works on mobile screen sizes
- [ ] Monthly API cost stays under $1.00

#### Task 8.2 — Vercel Deployment

- [ ] Push to GitHub repository
- [ ] Connect to Vercel
- [ ] Set all environment variables in Vercel dashboard
- [ ] Test production build
- [ ] (Optional) Configure custom domain

---

## 📊 Task Priority Matrix

| Priority           | Tasks                             | Phase |
| ------------------ | --------------------------------- | ----- |
| 🔥 Must (MVP Core) | 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.1 | 1–4   |
| ⚡ High            | 4.2, 4.3, 6.1                     | 4, 6  |
| 🌟 Medium          | 5.1, 5.2, 7.1                     | 5, 7  |
| 💡 Low (Post-MVP)  | 5.3, 7.2 (calendar view)          | 5, 7  |

---

## 🚀 Recommended Implementation Order

```
1. Task 1.1  → Next.js setup
2. Task 1.2  → Notion connection
3. Task 2.1  → Foods JSON database
4. Task 2.2  → Nutrition calculation
5. Task 3.1  → Food entry form
6. Task 3.2  → Food entry API
7. Task 4.1  → Daily summary
8. Task 6.1  → User weight/settings
9. Task 4.2  → Deficiency logic
10. Task 4.3  → Deficiency UI
11. Task 5.1  → Claude API setup
12. Task 5.2  → AI food suggestions
13. Task 7.1  → Dashboard integration
14. Task 8.1  → QA
15. Task 8.2  → Deploy to Vercel
```

---

_Document version: 1.0 — Ready for AI-assisted development_
