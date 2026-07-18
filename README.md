# 🧠 CBT Habit Breaker AI — Positive Behavioral Change Companion

A highly secure, empathetic, and responsive client-side AI Agent specialized in **Cognitive Behavioral Therapy (CBT)** and **Behavioral Psychology**. This static web application empowers individuals to understand, track, and overcome negative habits and addictive behaviors (such as excessive screen time, substance cravings, compulsive routines, and sleep disruptions) through evidence-based cognitive restructuring, clinical box breathing, and progression dashboards.

---

### 🚀 **Deployment Information**
* **Live Web App**: [https://rohankoushikrv.github.io/Koushik_PromptWars-HYD-GoogleForDevelopers26/CBT-HabitBreaker-AI/index.html](https://rohankoushikrv.github.io/Koushik_PromptWars-HYD-GoogleForDevelopers26/CBT-HabitBreaker-AI/index.html)
* **Public GitHub Repository**: [https://github.com/rohankoushikrv/Koushik_PromptWars-HYD-GoogleForDevelopers26](https://github.com/rohankoushikrv/Koushik_PromptWars-HYD-GoogleForDevelopers26)

<img width="1919" height="995" alt="image" src="https://github.com/user-attachments/assets/46a0e5ef-682c-462a-8344-cdeb254866b8" />
<img width="1919" height="995" alt="image" src="https://github.com/user-attachments/assets/7a0eeaea-ef89-42ab-bc74-b84cf65e90a6" />
<img width="1919" height="989" alt="image" src="https://github.com/user-attachments/assets/a1b36d2a-6147-4636-b022-260eaaef24cf" />
<img width="1919" height="988" alt="image" src="https://github.com/user-attachments/assets/c4b66d6d-7209-42fe-b74e-9885be1c99f4" />
<img width="1919" height="994" alt="image" src="https://github.com/user-attachments/assets/5286078e-44f8-49fe-b615-736176d92957" />


---

## 🏆 **AI Evaluation Score Dashboard**

The application has been thoroughly audited and graded with a final score of **91.43 / 100** by the Google for Developers PromptWars grading engine!

| Evaluation Parameter | Score | Status |
| :--- | :---: | :---: |
| ⚡ **Efficiency** | **100 / 100** | 🟢 Perfect |
| ♿ **Accessibility** | **96 / 100** | 🟢 Exceptional |
| 🧪 **Testing & Coverage** | **96 / 100** | 🟢 Exceptional |
| 🔒 **Security & Privacy** | **93 / 100** | 🟢 Highly Secure |
| 🧠 **Problem Alignment** | **93 / 100** | 🟢 Expert Level |
| 💻 **Code Quality** | **80 / 100** | 🟢 High Quality |
| **🥇 Final Cumulative Grade** | **91.43 / 100** | **🌟 Master Tier** |

---

## 🎯 **Core Cognitive Features**

### 1. 🧠 **CBT-Driven AI Coach (Gemini 1.5/3.5)**
Our conversational core runs directly on a client-side Google Generative AI integration, enforcing strict therapeutic guidelines:
- **Cognitive Restructuring**: Targets cognitive distortions (such as catastrophizing, all-or-nothing thinking, and overgeneralization).
- **Behavioral Activation**: Guides users to formulate and schedule constructive, healthy replacement routines.
- **Habit Loop Analysis**: Identifies core **Cues (Triggers)**, **Routines**, and **Rewards** to reshape addictive behaviors.

### 2. 🌀 **Urge Surfer — Clinical Box Breathing Widget**
A built-in interactive breathing aid based on clinical pacing models. It walks users through four distinct phases (Inhale, Hold, Exhale, Hold) with fluid scale animations and visual countdown guidelines to help them calm their nervous system during active cravings.

### 3. 📊 **Progress Tracker & Streak Dashboard**
Provides real-time interactive tracking:
- **🟢 Overcame Trigger**: Celebrates wins, updates local streak storage, and fires a responsive confetti particle simulation.
- **🔴 Gave In / Reset**: Handles slips with utmost compassion. Resets the streak without shame and automatically prompts the bot to run a customized CBT relapse-rebound session.

### 4. ♿ **Top-Tier Accessibility (WCAG compliant)**
- Full screen-reader support via explicit landmarks, `aria-label` attributes, and `role` contexts on all navigation controls, suggestion chips, text areas, and close buttons.
- Responsive live announcements (`aria-live="polite"`) for chatbot replies, focus-habit details, and progression counts.
- High-contrast visual outlines matching modern `:focus-visible` CSS specifications for seamless keyboard-only tabbing.

### 5. 🔒 **Advanced Security & XSS Protection**
- **XSS Sanitation**: Multi-stage client-side character escaping (`&`, `<`, `>`, `"`, `'`) blocks HTML injections before parsing formatting regexes (such as markdown bold/italic tags).
- **Immediate Local Crisis Interception**: Evaluates user statements locally on the client machine. When self-harm or suicidal keywords are detected, the system **blocks external LLM API calls instantly**, launches the emergency helpline resource modal, and displays immediate national hotlines (988 and SAMHSA) with maximum empathy.

---

## 🧪 **Testing Suite (96% Coverage)**

The repository includes a modern, high-speed unit and integration test suite running on Node's native test runner (`node:test`) with **zero external package dependencies**.

### **Run Tests Locally**
```bash
# Clone the repository
git clone https://github.com/rohankoushikrv/Koushik_PromptWars-HYD-GoogleForDevelopers26.git
cd Koushik_PromptWars-HYD-GoogleForDevelopers26/CBT-HabitBreaker-AI

# Execute the test runner
npm test
```

### **Included Test Modules**
1. `validators.test.js`: Validates input sanitation, length checks, automatic habit extraction, and emotion pattern analyzers.
2. `security.test.js`: Validates crypto session generation, password hashing, and AES-256 data encryption/decryption modules.
3. `cbt-agent.test.js`: Validates prompt builders, structured Markdown-JSON schema extractors, local crisis triggers, and behavior classifiers.
4. `server.test.js`: Performs complete mocked Express endpoint routing integration tests for progress tracking, health checks, and session purges.
5. `uat.test.js`: Executes extensive **User Acceptance Testing (UAT)** stories covering E2E onboarding, successful coping wins, relapse recovery, crisis intercepts, and box breathing state machines.

---

## 🏗️ **Architecture & Deployment**

The companion utilizes a highly responsive **Serverless / SPA Architecture** that executes entirely in the user's browser:
```
User Device (Browser) ──[ DIRECT FETCH (Direct HTTPS Client) ]──> Google Gemini API
        │
  (LocalStorage)
        ↓
  Saved Sessions (100% Private)
```

- **Deployment**: Automatic pipeline triggered via GitHub Actions, copying production files and building on the `gh-pages` branch.
- **Privacy Assurance**: No third-party analytical trackers, no remote database storage, and absolute local privacy.

---

## 🤝 **Contributing & Feedback**
We welcome contributions to further enhance cognitive therapy access:
1. Fork the repo and create your feature branch (`git checkout -b feature/AmazingFeature`).
2. Verify all tests pass cleanly using `npm test`.
3. Submit a Pull Request.

---

## 📝 **License**
This project is licensed under the standard **MIT License** — see the [LICENSE](./LICENSE) file for complete details.
