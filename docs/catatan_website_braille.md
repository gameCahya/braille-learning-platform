# 📝 CATATAN SESI: Penambahan Tutorial & Image Support

**Tanggal:** Maret 2025  
**Project:** Braille English Learning Platform  
**Status:** ✅ Documentation Complete - Ready for Implementation

---

## 📋 Daftar Isi

1. [Tutorial/Onboarding System](#tutorial-system)
2. [Image Support Implementation](#image-support)
3. [TypeScript Types Fix](#types-fix)
4. [Files Overview](#files-overview)
5. [Implementation Checklist](#checklist)
6. [Next Steps](#next-steps)

---

## 🎓 Tutorial/Onboarding System {#tutorial-system}

### Fitur yang Direncanakan

**Purpose:** Memberikan guided tour untuk first-time users, terutama untuk accessibility (tunanetra).

### Option 1: Interactive Tutorial (Driver.js)

**Library:** `driver.js`

**Features:**
- ✅ Step-by-step interactive tour
- ✅ Highlight specific elements
- ✅ Progress indicator
- ✅ Keyboard navigation (Arrow keys, Escape)
- ✅ Screen reader announcements
- ✅ Auto-start for first-time users
- ✅ Keyboard shortcut (Press 'H' to restart)
- ✅ Skip option
- ✅ Multiple contexts (dashboard, modules, lessons)

**Installation:**
```bash
npm install driver.js
# atau
pnpm add driver.js
```

**Files to Create:**

1. **`lib/tutorial/steps.ts`**
   - Tutorial step definitions
   - Separate steps for: Dashboard, Modules, Lessons
   - Popover configurations

2. **`components/tutorial/TutorialDriver.tsx`**
   - Main tutorial component
   - Auto-start logic
   - Keyboard shortcuts
   - Screen reader support
   - localStorage persistence

3. **`app/tutorial.css`**
   - Custom styling for tutorial
   - Accessibility focus indicators
   - Popover styling

**Key Features:**

```typescript
// Auto-start for first-time users
const seen = localStorage.getItem(storageKey);
if (!seen && autoStart) {
  setTimeout(() => startTutorial(), 1000);
}

// Keyboard shortcut (H key)
window.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') {
    startTutorial();
  }
});

// Screen reader announcements
const announceToScreenReader = (message: string) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
};
```

**Tutorial Steps Example:**

```typescript
export const dashboardTutorialSteps: DriveStep[] = [
  {
    element: "#welcome-message",
    popover: {
      title: "Welcome to Braille Learning! 👋",
      description: "Let me show you around...",
      side: "bottom",
    },
  },
  {
    element: "#progress-overview",
    popover: {
      title: "Your Progress",
      description: "Track your learning journey...",
      side: "bottom",
    },
  },
  // ... more steps
];
```

**Usage:**

```typescript
// In any page
import TutorialDriver from "@/components/tutorial/TutorialDriver";
import { dashboardTutorialSteps } from "@/lib/tutorial/steps";

<TutorialDriver
  steps={dashboardTutorialSteps}
  storageKey="dashboard-tutorial-seen"
  autoStart={true}
  showButton={true}
/>
```

---

### Option 2: Simple Onboarding Modal

**Alternative:** Jika tidak mau dependency besar, pakai modal onboarding.

**Features:**
- ✅ Multi-step modal
- ✅ Progress indicator
- ✅ Text-to-speech support
- ✅ Images for each step
- ✅ Skip option
- ✅ localStorage persistence

**File to Create:**

1. **`components/tutorial/OnboardingModal.tsx`**
   - Dialog-based onboarding
   - Step navigation
   - Image support
   - Audio narration

**Onboarding Steps:**

```typescript
const onboardingSteps = [
  {
    title: "Welcome to Braille Learning! 👋",
    description: "This platform helps you learn English through Braille.",
    image: "/images/onboarding/welcome.svg",
  },
  {
    title: "Learn at Your Pace",
    description: "Complete 10 modules from beginner to intermediate.",
    image: "/images/onboarding/modules.svg",
  },
  // ... 3-5 steps total
];
```

**Advantages:**
- Simpler implementation
- No external dependency
- Full control over styling
- Easy to customize

---

## 🖼️ Image Support Implementation {#image-support}

### TypeScript Types Update

**Updated Fields:**

```typescript
export interface Lesson {
  id: string;
  title: string;
  content: string;
  braille?: string;
  example?: string;
  image?: string;        // NEW: Lesson image URL
  imageAlt?: string;     // NEW: Alt text for accessibility
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "text-to-braille" | "braille-to-text";
  question: string;
  questionImage?: string;   // NEW: Question image
  options?: string[];
  optionImages?: string[];  // NEW: Images for each option
  correctAnswer: string;
  hint?: string;
  points: number;
  explanation?: string;     // NEW: Answer explanation
}
```

---

### Components with Image Support

#### 1. **Lesson Display** ✅ Already Implemented

**File:** `app/(dashboard)/learn/modules/[id]/page.tsx`

**Status:** ✅ Working - displays lesson images

**Code:**
```typescript
{currentLesson.image && (
  <div className="relative w-full h-64 rounded-lg overflow-hidden">
    <img
      src={currentLesson.image}
      alt={currentLesson.imageAlt || currentLesson.title}
      className="w-full h-full object-cover"
    />
  </div>
)}
```

**Usage in modules.ts:**
```typescript
{
  id: "lesson-10-1",
  title: "Pets",
  content: "Cat: ⠉⠁⠞ (cat). Dog: ⠙⠕⠛ (dog).",
  braille: "⠉⠁⠞ ⠙⠕⠛",
  image: "/images/modules/animals/pets.jpg",
  imageAlt: "Pictures of cat and dog",
}
```

---

#### 2. **Quiz Component** ⚠️ Need Update

**File:** `components/learning/QuizComponent.tsx`

**Status:** ⚠️ Types support images, but UI code missing

**Need to Add:**

**A. Question Image:**
```typescript
<CardContent className="space-y-4">
  {/* Question Image */}
  {currentExercise.questionImage && (
    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 border-2 border-slate-200">
      <img
        src={currentExercise.questionImage}
        alt="Question image"
        className="w-full h-full object-cover"
      />
    </div>
  )}

  <p className="text-lg font-medium">{currentExercise.question}</p>
  {/* ... */}
</CardContent>
```

**B. Option Images:**
```typescript
{currentExercise.type === "multiple-choice" && (
  <div className="space-y-3">
    {currentExercise.options?.map((option, index) => (
      <Button
        key={index}
        variant={selectedAnswer === option ? "default" : "outline"}
        className="w-full justify-start text-left h-auto py-4"
        onClick={() => handleAnswerSelect(option)}
        disabled={answered}
      >
        <div className="flex items-center gap-4 w-full">
          {/* Option Image */}
          {currentExercise.optionImages?.[index] && (
            <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 border-2 border-slate-200">
              <img
                src={currentExercise.optionImages[index]}
                alt={`Option ${option}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="flex-1">{option}</span>
        </div>
      </Button>
    ))}
  </div>
)}
```

**Usage Example:**
```typescript
// Quiz dengan gambar soal
{
  id: "ex-10-1",
  type: "multiple-choice",
  question: "What animal is shown in the picture?",
  questionImage: "/images/modules/animals/quiz-cat.jpg",
  options: ["Dog", "Cat", "Rabbit"],
  correctAnswer: "Cat",
  explanation: "This is a cat. In Braille: ⠉⠁⠞",
}

// Quiz dengan gambar opsi
{
  id: "ex-10-2",
  type: "multiple-choice",
  question: "Select the picture of an elephant",
  options: ["A", "B", "C", "D"],
  optionImages: [
    "/images/modules/animals/tiger.jpg",
    "/images/modules/animals/elephant.jpg",
    "/images/modules/animals/monkey.jpg",
    "/images/modules/animals/cow.jpg",
  ],
  correctAnswer: "B",
  explanation: "Option B shows an elephant.",
}
```

---

### Folder Structure untuk Images

```
public/
└── images/
    ├── modules/
    │   ├── animals/         # Module 10
    │   │   ├── pets.jpg
    │   │   ├── farm-animals.jpg
    │   │   ├── wild-animals.jpg
    │   │   ├── quiz-cat.jpg
    │   │   ├── tiger.jpg
    │   │   ├── elephant.jpg
    │   │   ├── monkey.jpg
    │   │   └── cow.jpg
    │   ├── bathroom/        # Module 9
    │   │   ├── soap.jpg
    │   │   ├── toothbrush.jpg
    │   │   └── towel.jpg
    │   ├── classroom/       # Module 6
    │   │   ├── table.jpg
    │   │   ├── chair.jpg
    │   │   └── book.jpg
    │   ├── colors/          # Module 7
    │   │   ├── primary-colors.jpg
    │   │   ├── secondary-colors.jpg
    │   │   └── quiz-red.jpg
    │   └── body-parts/      # Module 8
    │       ├── face.jpg
    │       ├── hands.jpg
    │       └── torso.jpg
    └── onboarding/          # Tutorial images (optional)
        ├── welcome.svg
        ├── modules.svg
        ├── ai-tutor.svg
        ├── progress.svg
        └── accessibility.svg
```

**Create Folders:**
```bash
mkdir -p public/images/modules/{animals,bathroom,classroom,colors,body-parts}
mkdir -p public/images/onboarding
```

---

### Image Optimization Tips

1. **Size Recommendations:**
   - Lesson images: 800x600px
   - Quiz question images: 400x300px
   - Quiz option images: 200x200px
   - Onboarding images: 600x400px

2. **Format:**
   - WebP (best for web)
   - JPG (for photos)
   - PNG (for illustrations)
   - SVG (for icons/diagrams)

3. **File Size:**
   - < 200KB per image
   - Use compression tools

4. **Alt Text:**
   - Always provide descriptive alt text
   - Essential for screen readers

5. **Free Image Sources:**
   - Unsplash: https://unsplash.com
   - Pexels: https://pexels.com
   - Pixabay: https://pixabay.com
   - Freepik: https://freepik.com

---

## 🔧 TypeScript Types Fix {#types-fix}

### Issues Found:

#### 1. **Module.orderNumber → order_number**

**Problem:** Field name tidak match dengan database schema.

```typescript
// ❌ WRONG - camelCase
export interface Module {
  orderNumber: number;
}

// ✅ CORRECT - snake_case (match database)
export interface Module {
  order_number: number;
}
```

**Impact:** Semua file yang pakai `module.orderNumber` harus diupdate.

---

#### 2. **QuizResult Missing Fields**

**Problem:** Database punya fields yang tidak ada di type.

```typescript
// ❌ INCOMPLETE
export interface QuizResult {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  answers: Record<string, string>;
  created_at: string;
}

// ✅ COMPLETE
export interface QuizResult {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  total_points: number;        // NEW
  correct_answers: number;     // NEW
  total_questions: number;     // NEW
  answers: Record<string, string>;
  details?: Record<string, unknown>; // NEW (JSONB)
  feedback?: string;           // NEW
  created_at: string;
}
```

---

### Fixed Types - Complete Version

**File:** `types/index.ts`

```typescript
// Database Models
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: ModuleContent;
  braille_content: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  order_number: number; // FIXED: snake_case
  created_at: string;
}

export interface ModuleContent {
  lessons: Lesson[];
  exercises?: Exercise[];
  summary?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  description?: string;
  braille?: string;
  example?: string;
  audioUrl?: string;
  image?: string;
  imageAlt?: string;
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "text-to-braille" | "braille-to-text";
  question: string;
  questionImage?: string;
  options?: string[];
  optionImages?: string[];
  correctAnswer: string;
  hint?: string;
  points: number;
  explanation?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  score?: number | null;
  completed_at: string | null;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  total_points: number;        // ADDED
  correct_answers: number;     // ADDED
  total_questions: number;     // ADDED
  answers: Record<string, string>;
  details?: Record<string, unknown>; // ADDED
  feedback?: string;           // ADDED
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}

export interface BrailleConversion {
  input: string;
  output: string;
  direction: "text-to-braille" | "braille-to-text";
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
```

---

### Files Requiring Updates After Type Fix

| File | Change Required | Find | Replace |
|------|----------------|------|---------|
| `lib/data/modules.ts` | All module definitions | `orderNumber:` | `order_number:` |
| `app/(dashboard)/learn/modules/page.tsx` | Usage in functions | `m.orderNumber` | `m.order_number` |
| Any component referencing modules | Module property access | `.orderNumber` | `.order_number` |

**Quick Fix Command:**

```bash
# Find & Replace in VS Code
# Ctrl/Cmd + Shift + H
# Find: orderNumber
# Replace: order_number
# Files: lib/data/modules.ts, app/(dashboard)/**/*.tsx
```

---

## 📂 Files Overview {#files-overview}

### Files to CREATE (New):

| File | Purpose | Priority |
|------|---------|----------|
| `lib/tutorial/steps.ts` | Tutorial step definitions | Medium |
| `components/tutorial/TutorialDriver.tsx` | Main tutorial component | Medium |
| `app/tutorial.css` | Tutorial custom styling | Medium |
| `components/tutorial/OnboardingModal.tsx` | Alternative onboarding | Low |

### Files to UPDATE:

| File | Changes | Priority |
|------|---------|----------|
| `types/index.ts` | Fix `order_number`, add QuizResult fields | High |
| `lib/data/modules.ts` | Change `orderNumber` → `order_number` | High |
| `app/(dashboard)/learn/modules/page.tsx` | Update usage to `order_number` | High |
| `components/learning/QuizComponent.tsx` | Add image display code | Medium |
| `app/layout.tsx` | Import `tutorial.css` | Medium |

### Folders to CREATE:

```bash
mkdir -p public/images/modules/{animals,bathroom,classroom,colors,body-parts}
mkdir -p public/images/onboarding
```

---

## ✅ Implementation Checklist {#checklist}

### Phase 1: TypeScript Types Fix (HIGH PRIORITY)

- [ ] Update `types/index.ts`
  - [ ] Change `Module.orderNumber` → `Module.order_number`
  - [ ] Add missing QuizResult fields
- [ ] Update `lib/data/modules.ts`
  - [ ] Find & replace `orderNumber:` → `order_number:`
- [ ] Update `app/(dashboard)/learn/modules/page.tsx`
  - [ ] Update function parameters
  - [ ] Update property access
- [ ] Run TypeScript check: `npm run build`
- [ ] Run ESLint: `npm run lint`
- [ ] Test module unlock logic

### Phase 2: Image Support (MEDIUM PRIORITY)

- [ ] Create image folders
  ```bash
  mkdir -p public/images/modules/{animals,bathroom,classroom,colors,body-parts}
  ```
- [ ] Update `components/learning/QuizComponent.tsx`
  - [ ] Add question image display
  - [ ] Add option images in buttons
- [ ] Add images to modules
  - [ ] Download/create images
  - [ ] Update `lib/data/modules.ts` with image URLs
- [ ] Test image display
  - [ ] Lesson images
  - [ ] Quiz question images
  - [ ] Quiz option images

### Phase 3: Tutorial System (LOW PRIORITY - Optional)

- [ ] Install driver.js: `npm install driver.js`
- [ ] Create `lib/tutorial/steps.ts`
- [ ] Create `components/tutorial/TutorialDriver.tsx`
- [ ] Create `app/tutorial.css`
- [ ] Import CSS in `app/layout.tsx`
- [ ] Add tutorial to dashboard
- [ ] Add tutorial to modules page
- [ ] Add tutorial to lesson page
- [ ] Add IDs to elements
  - [ ] `#welcome-message`
  - [ ] `#progress-overview`
  - [ ] `#quick-actions`
  - [ ] `#sidebar-nav`
  - [ ] `#braille-reference`
  - [ ] `#user-menu`
- [ ] Test tutorial flow
- [ ] Test keyboard shortcuts (H key)
- [ ] Test screen reader announcements
- [ ] Test skip functionality

---

## 🚀 Next Steps {#next-steps}

### Immediate Actions:

1. **Fix TypeScript Types** (30 minutes)
   - Update types/index.ts
   - Find & replace orderNumber
   - Test build

2. **Update QuizComponent** (1 hour)
   - Add image display code
   - Test with sample images

3. **Add Sample Images** (2 hours)
   - Download from Unsplash/Pexels
   - Optimize sizes
   - Update modules.ts

### Future Enhancements:

4. **Tutorial System** (4-6 hours)
   - Implement Driver.js
   - Create all step definitions
   - Test accessibility

5. **Image Optimization** (2 hours)
   - Convert to WebP
   - Add lazy loading
   - Implement Next.js Image component

6. **Content Creation** (Ongoing)
   - Add images to all 10 modules
   - Create quiz images
   - Optimize for accessibility

---

## 📚 Resources

### Libraries:
- **Driver.js:** https://driverjs.com
- **Next.js Image:** https://nextjs.org/docs/api-reference/next/image

### Image Sources:
- **Unsplash:** https://unsplash.com
- **Pexels:** https://pexels.com
- **Pixabay:** https://pixabay.com
- **Freepik:** https://freepik.com

### Accessibility:
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA:** https://www.w3.org/WAI/ARIA/apg/
- **Screen Readers:** NVDA (Windows), VoiceOver (Mac)

---

## 🎯 Success Criteria

### Must Have:
- ✅ TypeScript types match database schema
- ✅ No TypeScript errors
- ✅ Lesson images display correctly
- ✅ Quiz images display correctly

### Should Have:
- ✅ Tutorial system working
- ✅ All 10 modules have images
- ✅ Images optimized for web

### Nice to Have:
- ✅ Next.js Image optimization
- ✅ Lazy loading
- ✅ WebP format
- ✅ Progressive image loading

---

## 🐛 Known Issues & Solutions

### Issue 1: orderNumber vs order_number
**Status:** Documented  
**Solution:** Find & replace in all files  
**Priority:** High

### Issue 2: QuizResult missing fields
**Status:** Documented  
**Solution:** Update types/index.ts  
**Priority:** High

### Issue 3: QuizComponent doesn't display images
**Status:** Documented  
**Solution:** Add display code (provided above)  
**Priority:** Medium

---

## 💡 Key Learnings

1. **Always match database schema** - Use snake_case if database uses snake_case
2. **Type completeness** - Ensure all database fields are in TypeScript types
3. **Accessibility first** - Images must have alt text, keyboard navigation required
4. **Progressive enhancement** - Images are optional, app works without them
5. **User testing** - Test with screen readers throughout development

---

**Session Summary:** Documented tutorial system options, image support implementation, and fixed TypeScript type inconsistencies. Ready for implementation phase.

**Status:** 📝 DOCUMENTATION COMPLETE

---

*Last Updated: Maret 2025*  
*Project: Braille English Learning Platform*  
*Next Session: Implementation of fixes and features*