/**
 * SmartChef Frontend Engine & Security Controller
 */

// Global State
let savedModel = localStorage.getItem('smartchef_api_model');
if (savedModel === 'gemini-2.5-flash' || !savedModel) {
    savedModel = 'gemini-3.5-flash';
    localStorage.setItem('smartchef_api_model', 'gemini-3.5-flash');
}
const state = {
    mode: 'sandbox', // 'sandbox' or 'api'
    apiKey: localStorage.getItem('smartchef_api_key') || '',
    model: savedModel || 'gemini-3.5-flash',
};

// Ingredient Database with Estimated Costs and Classifications
const INGREDIENT_DB = {
    // Premium Items
    "quinoa": { cost: 4.50, category: "grain", premium: true, budgetAlternative: "brown rice" },
    "salmon": { cost: 8.50, category: "protein", premium: true, budgetAlternative: "tofu" },
    "avocado": { cost: 2.50, category: "produce", premium: true, budgetAlternative: "spinach" },
    "shrimp": { cost: 7.00, category: "protein", premium: true, budgetAlternative: "eggs" },
    "berries": { cost: 4.00, category: "produce", premium: true, budgetAlternative: "banana" },
    "pine nuts": { cost: 5.00, category: "nut", premium: true, budgetAlternative: "sunflower seeds" },
    "asparagus": { cost: 3.50, category: "produce", premium: true, budgetAlternative: "broccoli" },
    "greek yogurt": { cost: 3.00, category: "dairy", premium: true, budgetAlternative: "oats" },

    // Budget / Standard Items
    "brown rice": { cost: 1.20, category: "grain", premium: false },
    "white rice": { cost: 0.80, category: "grain", premium: false },
    "tofu": { cost: 1.80, category: "protein", premium: false },
    "chicken breast": { cost: 3.50, category: "protein", premium: false },
    "eggs": { cost: 1.50, category: "protein", premium: false },
    "banana": { cost: 0.50, category: "produce", premium: false },
    "spinach": { cost: 1.20, category: "produce", premium: false },
    "oats": { cost: 0.90, category: "grain", premium: false },
    "peanut butter": { cost: 1.50, category: "spread", premium: false, allergen: "peanuts" },
    "peanuts": { cost: 1.00, category: "nut", premium: false, allergen: "peanuts" },
    "sunflower seeds": { cost: 1.50, category: "seed", premium: false },
    "broccoli": { cost: 1.30, category: "produce", premium: false },
    "olive oil": { cost: 0.50, category: "oil", premium: false },
    "salt": { cost: 0.10, category: "spice", premium: false },
    "black pepper": { cost: 0.10, category: "spice", premium: false },
    "onion": { cost: 0.60, category: "produce", premium: false },
    "garlic": { cost: 0.40, category: "produce", premium: false },
    "bell pepper": { cost: 1.20, category: "produce", premium: false },
    "black beans": { cost: 0.90, category: "protein", premium: false }
};

// Recipe Database for Sandbox Mode
const RECIPE_LIBRARY = [
    {
        name: "Quinoa Salmon Bowl",
        category: "non-vegetarian",
        prep_time_mins: 25,
        ingredients: ["quinoa", "salmon", "avocado", "spinach", "olive oil"],
        instructions: [
            "Cook quinoa according to package instructions.",
            "Pan-sear salmon in olive oil for 4 minutes on each side.",
            "Assemble the bowl with spinach, sliced avocado, quinoa, and salmon."
        ]
    },
    {
        name: "High-Protein Tofu Rice Bowl",
        category: "vegetarian",
        prep_time_mins: 20,
        ingredients: ["brown rice", "tofu", "spinach", "bell pepper", "olive oil"],
        instructions: [
            "Cook brown rice.",
            "Cube tofu and stir-fry with bell pepper in olive oil until crispy.",
            "Wilt spinach in the pan and serve everything over brown rice."
        ]
    },
    {
        name: "Quick Scrambled Eggs & Avocado Toast",
        category: "vegetarian",
        prep_time_mins: 10,
        ingredients: ["eggs", "avocado", "olive oil", "salt", "black pepper"],
        instructions: [
            "Whisk eggs and scramble in a pan with olive oil.",
            "Mash avocado with salt and pepper.",
            "Spread avocado on toasted bread and serve with scrambled eggs."
        ]
    },
    {
        name: "Berry Protein Oatmeal",
        category: "vegetarian",
        prep_time_mins: 8,
        ingredients: ["oats", "berries", "banana", "greek yogurt"],
        instructions: [
            "Microwave oats with water or milk for 2 minutes.",
            "Stir in greek yogurt for high-protein content.",
            "Top with fresh berries and sliced bananas."
        ]
    },
    {
        name: "Peanut Butter Oatmeal",
        category: "vegetarian",
        prep_time_mins: 5,
        ingredients: ["oats", "peanut butter", "banana"],
        instructions: [
            "Cook oats for 2 minutes.",
            "Stir in a large spoonful of peanut butter.",
            "Top with sliced banana."
        ]
    },
    {
        name: "Quick Tofu & Spinach Stir-Fry",
        category: "vegetarian",
        prep_time_mins: 12,
        ingredients: ["tofu", "spinach", "garlic", "olive oil", "salt"],
        instructions: [
            "Sauté minced garlic in olive oil.",
            "Add cubed tofu and cook for 5 minutes.",
            "Add spinach and cook until wilted (approx 2 minutes). Season with salt."
        ]
    },
    {
        name: "Spiced Chicken Rice Bowl",
        category: "non-vegetarian",
        prep_time_mins: 22,
        ingredients: ["chicken breast", "brown rice", "onion", "bell pepper", "olive oil"],
        instructions: [
            "Cook brown rice.",
            "Dice chicken breast, onion, and bell pepper.",
            "Stir-fry chicken and vegetables in olive oil until cooked through. Serve over rice."
        ]
    },
    {
        name: "Fast Chicken & Veggie Wrap",
        category: "non-vegetarian",
        prep_time_mins: 14,
        ingredients: ["chicken breast", "spinach", "bell pepper", "olive oil"],
        instructions: [
            "Stir-fry sliced chicken and bell peppers in olive oil.",
            "Lay out a wrap, place spinach inside, and top with chicken and peppers."
        ]
    }
];

// Helper: Sanitize string to prevent injection attacks
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    // Strip HTML tag boundaries and basic script tags
    let sanitized = str.replace(/<[^>]*>/g, '');
    // Replace potentially dangerous characters to prevent injection
    sanitized = sanitized.replace(/[&<>"']/g, function(m) {
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
            default: return m;
        }
    });
    return sanitized.trim();
}

// Helper: Parse schedule density to evaluate free time constraint
function evaluateScheduleDensity(schedule) {
    const lowercase = schedule.toLowerCase();
    
    // Direct matches for high density / back-to-back
    if (
        lowercase.includes("back-to-back") || 
        lowercase.includes("no break") || 
        lowercase.includes("busy") || 
        lowercase.includes("hectic") || 
        lowercase.includes("meetings all day") ||
        lowercase.includes("tight schedule")
    ) {
        return { isBusy: true, reason: "Schedule contains keywords indicating high-density constraints." };
    }
    
    // Search for meeting durations if present (e.g. "9 AM to 6 PM")
    // Simple heuristic parser for hours
    const hoursMatch = lowercase.match(/(\d+)\s*(am|pm)\s*to\s*(\d+)\s*(am|pm)/);
    if (hoursMatch) {
        let startHour = parseInt(hoursMatch[1]);
        const startAmPm = hoursMatch[2];
        let endHour = parseInt(hoursMatch[3]);
        const endAmPm = hoursMatch[4];
        
        if (startAmPm === 'pm' && startHour < 12) startHour += 12;
        if (startAmPm === 'am' && startHour === 12) startHour = 0;
        if (endAmPm === 'pm' && endHour < 12) endHour += 12;
        if (endAmPm === 'am' && endHour === 12) endHour = 0;
        
        const workDuration = endHour - startHour;
        if (workDuration >= 8) {
            return { isBusy: true, reason: `Long work shift detected (${workDuration} hours) restricting daily cooking time.` };
        }
    }
    
    return { isBusy: false, reason: "Adequate cooking time available (> 30 mins free time)." };
}

// Helper: Extract allergens from dietary preferences
function getAvoidedAllergens(preferences) {
    const lowercase = preferences.toLowerCase();
    const allergenList = [];
    
    const allergenMap = {
        peanut: ["peanut", "peanuts"],
        nut: ["nut", "nuts", "almond", "almonds", "cashew", "cashews", "walnut", "walnuts", "pecan", "pecans"],
        gluten: ["gluten", "wheat", "barley", "rye"],
        dairy: ["dairy", "milk", "cheese", "yogurt", "cream", "butter"],
        soy: ["soy", "soybean", "soybeans", "tofu"],
        shellfish: ["shellfish", "shrimp", "lobster", "crab", "prawn", "prawns"],
        seafood: ["seafood", "fish", "salmon", "tuna", "shrimp", "prawns", "crab"],
        egg: ["egg", "eggs"]
    };

    Object.entries(allergenMap).forEach(([allergen, synonyms]) => {
        const containsAvoidance = synonyms.some(term =>
            lowercase.includes(`avoid ${term}`) ||
            lowercase.includes(`avoids ${term}`) ||
            lowercase.includes(`no ${term}`) ||
            lowercase.includes(`allergic to ${term}`) ||
            lowercase.includes(`${term}-free`)
        );

        if (containsAvoidance) {
            allergenList.push(allergen);
        }
    });
    
    return Array.from(new Set(allergenList));
}

// Helper: Parse Pantry items
function getPantryStaples(pantryText) {
    if (!pantryText) return [];
    return pantryText.toLowerCase()
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

// Backend Simulation Logic (Core processing engine)
function processMealPlanAlgorithmically(schedule, preferences, budget, pantry) {
    // 1. Sanitize
    const cleanSchedule = sanitizeInput(schedule);
    const cleanPreferences = sanitizeInput(preferences);
    const cleanPantry = sanitizeInput(pantry);
    const budgetLimit = parseFloat(budget) || 15.00;

    const timeFeasibility = evaluateScheduleDensity(cleanSchedule);
    const allergens = getAvoidedAllergens(cleanPreferences);
    const pantryStaples = getPantryStaples(cleanPantry);
    const isVegetarian = cleanPreferences.toLowerCase().includes("vegetarian") || cleanPreferences.toLowerCase().includes("vegan");

    // 2. Select Recipes based on Time Constraints & Dietary Preferences
    const maxPrepTime = timeFeasibility.isBusy ? 15 : 999;
    
    // Helper to find a suitable recipe from library
    const findRecipe = (mealType, excludeNames = []) => {
        // Filter recipes
        let candidates = RECIPE_LIBRARY.filter(r => {
            // Exclude already picked recipes
            if (excludeNames.includes(r.name)) return false;
            
            // Time feasibility check
            if (r.prep_time_mins > maxPrepTime) return false;
            
            // Diet check
            if (isVegetarian && r.category === "non-vegetarian") return false;
            
            // Allergen safety checks
            const hasAllergen = r.ingredients.some(ing => {
                const ingLower = ing.toLowerCase();
                return allergens.some(allg => {
                    if (allg === 'peanut' && (ingLower.includes('peanut') || ingLower === 'peanuts')) return true;
                    if (allg === 'nut' && (ingLower.includes('nut') || ingLower.includes('peanut'))) return true;
                    if (allg === 'dairy' && (ingLower.includes('yogurt') || ingLower.includes('cheese') || ingLower.includes('milk'))) return true;
                    return ingLower.includes(allg);
                });
            });
            if (hasAllergen) return false;
            
            return true;
        });
        
        // Sort to fit breakfast vs dinner heuristics
        candidates.sort((a, b) => {
            if (mealType === 'breakfast') return a.prep_time_mins - b.prep_time_mins; // faster recipes for breakfast
            return b.prep_time_mins - a.prep_time_mins; // hearty recipes for lunch/dinner
        });
        
        return candidates[0] || RECIPE_LIBRARY.find(r => !isVegetarian || r.category === 'vegetarian'); // fallback
    };

    const breakfast = findRecipe('breakfast');
    const lunch = findRecipe('lunch', [breakfast.name]);
    const dinner = findRecipe('dinner', [breakfast.name, lunch.name]);

    // 3. Compile Grocery List and Estimate Costs
    const neededIngredients = new Set([
        ...breakfast.ingredients,
        ...lunch.ingredients,
        ...dinner.ingredients
    ]);

    let groceryList = [];
    let smartSubstitutions = [];
    
    // First Pass: Calculate costs and mark pantry staples
    neededIngredients.forEach(item => {
        const isStaple = pantryStaples.some(staple => staple.includes(item) || item.includes(staple));
        const dbEntry = INGREDIENT_DB[item] || { cost: 1.50, premium: false };
        
        groceryList.push({
            item: item,
            estimated_cost_usd: isStaple ? 0.00 : dbEntry.cost,
            is_pantry_staple: isStaple
        });
    });

    // Helper to calculate total grocery bill (only non-pantry items)
    const calcTotalCost = (list) => list.reduce((sum, item) => sum + item.estimated_cost_usd, 0);
    
    let totalCost = calcTotalCost(groceryList);

    // 4. Budget Feasibility Optimization Check
    if (totalCost > budgetLimit) {
        // We are over budget, let's optimize premium ingredients
        groceryList = groceryList.map(gItem => {
            if (gItem.is_pantry_staple) return gItem;
            
            const dbEntry = INGREDIENT_DB[gItem.item];
            if (dbEntry && dbEntry.premium && dbEntry.budgetAlternative) {
                const alt = dbEntry.budgetAlternative;
                const altEntry = INGREDIENT_DB[alt] || { cost: 1.50 };
                
                smartSubstitutions.push({
                    original_needed: gItem.item,
                    alternative: alt,
                    reason: `cost (replaces premium item to fit within $${budgetLimit} daily budget)`
                });
                
                return {
                    item: alt,
                    estimated_cost_usd: altEntry.cost,
                    is_pantry_staple: pantryStaples.some(staple => staple.includes(alt) || alt.includes(staple))
                };
            }
            return gItem;
        });
        
        // Deduplicate identical grocery items and preserve pantry staples
        const uniqueGroceryMap = new Map();
        groceryList.forEach(gItem => {
            const key = gItem.item.toLowerCase();
            if (!uniqueGroceryMap.has(key)) {
                uniqueGroceryMap.set(key, { ...gItem });
            } else {
                const existing = uniqueGroceryMap.get(key);
                uniqueGroceryMap.set(key, {
                    item: existing.item,
                    estimated_cost_usd: existing.is_pantry_staple || gItem.is_pantry_staple ? 0.00 : Math.min(existing.estimated_cost_usd, gItem.estimated_cost_usd),
                    is_pantry_staple: existing.is_pantry_staple || gItem.is_pantry_staple
                });
            }
        });
        groceryList = Array.from(uniqueGroceryMap.values());
        
        // Recalculate cost after optimizations
        totalCost = calcTotalCost(groceryList);
    }

    // Double check allergens in substitutions
    smartSubstitutions = smartSubstitutions.filter(sub => {
        const altLower = sub.alternative.toLowerCase();
        const hasAllergen = allergens.some(allg => {
            if (allg === 'peanut' && (altLower.includes('peanut') || altLower === 'peanuts')) return true;
            return altLower.includes(allg);
        });
        return !hasAllergen; // Only keep safe substitutions
    });

    const isFeasible = totalCost <= budgetLimit;
    const budgetStatusMessage = isFeasible 
        ? `Optimized meal plan fits comfortably within your $${budgetLimit} budget.`
        : `Even after cost-cutting optimizations, total cost ($${totalCost.toFixed(2)}) slightly exceeds your $${budgetLimit} budget.`;

    // Construct output JSON
    const outputJSON = {
        feasibility: {
            is_feasible: isFeasible,
            estimated_total_cost_usd: parseFloat(totalCost.toFixed(2)),
            budget_status_message: budgetStatusMessage
        },
        meal_plan: {
            breakfast: {
                name: breakfast.name,
                prep_time_mins: breakfast.prep_time_mins,
                instructions: breakfast.instructions
            },
            lunch: {
                name: lunch.name,
                prep_time_mins: lunch.prep_time_mins,
                instructions: lunch.instructions
            },
            dinner: {
                name: dinner.name,
                prep_time_mins: dinner.prep_time_mins,
                instructions: dinner.instructions
            }
        },
        grocery_list: groceryList,
        smart_substitutions: smartSubstitutions
    };

    return {
        json: outputJSON,
        timeConstraints: timeFeasibility
    };
}

// Live Gemini API Integration
async function generateMealPlanViaGemini(schedule, preferences, budget, pantry) {
    const cleanSchedule = sanitizeInput(schedule);
    const cleanPreferences = sanitizeInput(preferences);
    const cleanPantry = sanitizeInput(pantry);
    const budgetLimit = parseFloat(budget) || 15.00;

    const apiKey = state.apiKey;
    const model = state.model;

    if (!apiKey) {
        throw new Error("Gemini API Key is not configured. Please click 'Configure API' to enter a key.");
    }

    const systemInstruction = `You are the backend engine for "SmartChef", a secure AI micro-app. Your purpose is to generate an optimized, budget-aware cooking to-do list based on a user's daily schedule, preferences, and financial constraints.

Always process inputs securely. Sanitize all user data against injection or malicious scripts. Return data strictly in the requested JSON structure. Do not include conversational filler.

[PROCESSING LOGIC & VALIDATION]
1. Time-Feasibility Filter: Evaluate schedule density. If free time is under 30 minutes, restrict meals to <15-minute prep times.
2. Safety & Allergens: Cross-reference input preferences against all ingredients. Absolute zero-tolerance for explicit allergen inclusion.
3. Budget Feasibility Logic: 
   - Estimate local average costs for required grocery items.
   - Sum estimates. Compare against user's daily budget.
   - If sum > budget, trigger cost-cutting optimization. Replace premium items with budget alternatives (e.g., replace quinoa with brown rice).
   - Flag feasibility status clearly.

[OUTPUT SPECIFICATION]
Respond ONLY with a valid, minified JSON object matching this schema:
{
  "feasibility": {
    "is_feasible": boolean,
    "estimated_total_cost_usd": float,
    "budget_status_message": "string summary of financial viability"
  },
  "meal_plan": {
    "breakfast": { "name": "string", "prep_time_mins": integer, "instructions": ["string"] },
    "lunch": { "name": "string", "prep_time_mins": integer, "instructions": ["string"] },
    "dinner": { "name": "string", "prep_time_mins": integer, "instructions": ["string"] }
  },
  "grocery_list": [
    { "item": "string", "estimated_cost_usd": float, "is_pantry_staple": boolean }
  ],
  "smart_substitutions": [
    { "original_needed": "string", "alternative": "string", "reason": "string (cost or preference or allergy)" }
  ]
}`;

    const promptText = `Generate a customized budget-aware meal plan matching the system constraints for:
- Daily Schedule: "${cleanSchedule}"
- Diet/Preferences: "${cleanPreferences}"
- Daily Budget: "$${budgetLimit} USD"
- Current Pantry: "${cleanPantry}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/interactions`;

    const combinedInput = `${systemInstruction}

Generate a customized budget-aware meal plan matching the system constraints for:
- Daily Schedule: "${cleanSchedule}"
- Diet/Preferences: "${cleanPreferences}"
- Daily Budget: "$${budgetLimit} USD"
- Current Pantry: "${cleanPantry}"`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
            model: model,
            input: combinedInput
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const resData = await response.json();
    
    // Parse response defensively
    let rawText = '';
    if (resData.steps && Array.isArray(resData.steps) && resData.steps.length > 0) {
        // Find step of type 'model_output' or fallback to the last step's content
        const modelStep = resData.steps.find(s => s.type === 'model_output') || resData.steps[resData.steps.length - 1];
        if (modelStep && modelStep.content) {
            if (typeof modelStep.content.text === 'string') {
                rawText = modelStep.content.text;
            } else if (modelStep.content.parts && modelStep.content.parts[0] && typeof modelStep.content.parts[0].text === 'string') {
                rawText = modelStep.content.parts[0].text;
            }
        }
    }
    
    // Fallbacks
    if (!rawText) {
        if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts && resData.candidates[0].content.parts[0]) {
            rawText = resData.candidates[0].content.parts[0].text;
        } else if (resData.text) {
            rawText = resData.text;
        } else if (resData.output) {
            rawText = resData.output;
        } else {
            rawText = JSON.stringify(resData);
        }
    }
    
    // Extract JSON if wrapped in markdown code blocks
    if (rawText.includes("```json")) {
        rawText = rawText.split("```json")[1].split("```")[0];
    } else if (rawText.includes("```")) {
        rawText = rawText.split("```")[1].split("```")[0];
    }
    
    const parsedJSON = JSON.parse(rawText.trim());
    return parsedJSON;
}

// UI Controller Class
class SmartChefApp {
    constructor() {
        this.initDOMElements();
        this.bindEvents();
        this.loadAPIConfig();
    }

    initDOMElements() {
        // Inputs
        this.scheduleInput = document.getElementById('scheduleInput');
        this.preferencesInput = document.getElementById('preferencesInput');
        this.budgetsInput = document.getElementById('budgetsInput');
        this.pantryInput = document.getElementById('pantryInput');
        this.generateBtn = document.getElementById('generateBtn');

        // Mode Toggles
        this.sandboxModeBtn = document.getElementById('sandboxModeBtn');
        this.apiModeBtn = document.getElementById('apiModeBtn');

        // Presets
        this.loadPreset1 = document.getElementById('loadPreset1');
        this.loadPreset2 = document.getElementById('loadPreset2');

        // Output containers
        this.placeholderState = document.getElementById('placeholderState');
        this.loadingState = document.getElementById('loadingState');
        this.loadingStatusText = document.getElementById('loadingStatusText');
        this.dashboardContent = document.getElementById('dashboardContent');

        // Output Details
        this.costFeasibilityCard = document.getElementById('costFeasibilityCard');
        this.costFeasibilityVal = document.getElementById('costFeasibilityVal');
        this.costFeasibilityDesc = document.getElementById('costFeasibilityDesc');
        
        this.estimatedCostVal = document.getElementById('estimatedCostVal');
        this.estimatedCostDesc = document.getElementById('estimatedCostDesc');
        
        this.timeFeasibilityCard = document.getElementById('timeFeasibilityCard');
        this.timeFeasibilityVal = document.getElementById('timeFeasibilityVal');
        this.timeFeasibilityDesc = document.getElementById('timeFeasibilityDesc');

        // Recipes
        this.breakfastTime = document.getElementById('breakfastTime');
        this.breakfastName = document.getElementById('breakfastName');
        this.breakfastInstructions = document.getElementById('breakfastInstructions');
        
        this.lunchTime = document.getElementById('lunchTime');
        this.lunchName = document.getElementById('lunchName');
        this.lunchInstructions = document.getElementById('lunchInstructions');

        this.dinnerTime = document.getElementById('dinnerTime');
        this.dinnerName = document.getElementById('dinnerName');
        this.dinnerInstructions = document.getElementById('dinnerInstructions');

        // Grocery & Substitutions
        this.groceryListContainer = document.getElementById('groceryListContainer');
        this.subsTableBody = document.getElementById('subsTableBody');
        
        // JSON Output
        this.jsonOutputView = document.getElementById('jsonOutputView');
        this.copyJsonBtn = document.getElementById('copyJsonBtn');

        // Settings Modal
        this.settingsModal = document.getElementById('settingsModal');
        this.openSettingsBtn = document.getElementById('openSettingsBtn');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.apiModelInput = document.getElementById('apiModelInput');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.handleGeneration());
        this.copyJsonBtn.addEventListener('click', () => this.copyJsonToClipboard());

        // Mode select
        this.sandboxModeBtn.addEventListener('click', () => this.setMode('sandbox'));
        this.apiModeBtn.addEventListener('click', () => this.setMode('api'));

        // Presets
        this.loadPreset1.addEventListener('click', () => this.loadPreset(1));
        this.loadPreset2.addEventListener('click', () => this.loadPreset(2));

        // Modal triggers
        this.openSettingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
    }

    loadAPIConfig() {
        this.apiKeyInput.value = state.apiKey;
        this.apiModelInput.value = state.model;
    }

    setMode(mode) {
        state.mode = mode;
        if (mode === 'sandbox') {
            this.sandboxModeBtn.classList.add('active');
            this.apiModeBtn.classList.remove('active');
        } else {
            this.sandboxModeBtn.classList.remove('active');
            this.apiModeBtn.classList.add('active');
            if (!state.apiKey) {
                alert("Gemini API key is missing. Please click 'Configure API' to add your key.");
                this.openSettings();
            }
        }
    }

    loadPreset(num) {
        if (num === 1) {
            this.scheduleInput.value = "Work from home, lunch at 1 PM, evening gym at 6 PM";
            this.preferencesInput.value = "Vegetarian, high-protein, avoids peanuts";
            this.budgetsInput.value = 12;
            this.pantryInput.value = "Rice, olive oil, salt, black pepper";
        } else {
            this.scheduleInput.value = "9 AM to 6 PM back-to-back meetings, gym at 7 PM";
            this.preferencesInput.value = "Allergy to almonds, avoids mushrooms";
            this.budgetsInput.value = 25;
            this.pantryInput.value = "Salt, black pepper, eggs, olive oil";
        }
    }

    openSettings() {
        this.settingsModal.classList.add('open');
    }

    closeSettings() {
        this.settingsModal.classList.remove('open');
    }

    saveSettings() {
        const key = this.apiKeyInput.value.trim();
        const model = this.apiModelInput.value;
        
        state.apiKey = key;
        state.model = model;
        
        localStorage.setItem('smartchef_api_key', key);
        localStorage.setItem('smartchef_api_model', model);
        
        this.closeSettings();
    }

    async updateLoadingStatus(text, ms) {
        this.loadingStatusText.textContent = text;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleGeneration() {
        const scheduleVal = this.scheduleInput.value.trim();
        const prefVal = this.preferencesInput.value.trim();
        const budgetVal = this.budgetsInput.value.trim();
        const pantryVal = this.pantryInput.value.trim();

        if (!scheduleVal || !prefVal || !budgetVal) {
            alert("Please fill in the daily schedule, dietary preferences, and budget constraints.");
            return;
        }

        // Show loading state
        this.placeholderState.style.display = 'none';
        this.dashboardContent.style.display = 'none';
        this.loadingState.style.display = 'flex';

        try {
            await this.updateLoadingStatus("Running XSS & injection sanitization filters...", 600);
            await this.updateLoadingStatus("Evaluating daily schedule density and time feasibility...", 600);
            await this.updateLoadingStatus("Checking dietary preferences against food allergen database...", 600);
            await this.updateLoadingStatus("Sourcing grocery costs & calculating budget allocations...", 600);

            let resultJSON;
            let timeConstraints;

            if (state.mode === 'sandbox') {
                await this.updateLoadingStatus("Executing local sandbox rules engine...", 500);
                const localResult = processMealPlanAlgorithmically(scheduleVal, prefVal, budgetVal, pantryVal);
                resultJSON = localResult.json;
                timeConstraints = localResult.timeConstraints;
            } else {
                await this.updateLoadingStatus("Dispatching secure request to Gemini AI...", 200);
                resultJSON = await generateMealPlanViaGemini(scheduleVal, prefVal, budgetVal, pantryVal);
                // Extract local constraints check to display overlay correctly
                const localResult = processMealPlanAlgorithmically(scheduleVal, prefVal, budgetVal, pantryVal);
                timeConstraints = localResult.timeConstraints;
            }

            if (!resultJSON || typeof resultJSON !== 'object') {
                throw new Error("API returned an empty or invalid response.");
            }
            if (!resultJSON.feasibility || !resultJSON.meal_plan) {
                console.error("Malformed JSON structure:", resultJSON);
                throw new Error("API response does not match the required schema. Raw output: " + JSON.stringify(resultJSON));
            }

            await this.updateLoadingStatus("Formatting minified JSON output structure...", 400);
            this.renderDashboard(resultJSON, timeConstraints);
            
            // Show result
            this.loadingState.style.display = 'none';
            this.dashboardContent.style.display = 'flex';

        } catch (error) {
            console.error(error);
            alert(`Optimization Failed: ${error.message}`);
            this.loadingState.style.display = 'none';
            this.placeholderState.style.display = 'flex';
        }
    }

    renderDashboard(json, timeConstraints) {
        // Render raw JSON first (Minified as requested in output spec)
        this.jsonOutputView.textContent = JSON.stringify(json);

        // Budget Card
        const budgetStatus = json.feasibility.is_feasible;
        this.costFeasibilityVal.textContent = budgetStatus ? "Feasible" : "Critical";
        this.costFeasibilityDesc.textContent = json.feasibility.budget_status_message;
        
        // Remove old classes and add correct one
        this.costFeasibilityCard.className = "metric-card " + (budgetStatus ? "feasible" : "unfeasible");

        // Total Cost Card
        const budgetLimit = parseFloat(this.budgetsInput.value);
        this.estimatedCostVal.textContent = `$${json.feasibility.estimated_total_cost_usd.toFixed(2)}`;
        this.estimatedCostDesc.textContent = `Target budget: $${budgetLimit.toFixed(2)}`;

        // Time Feasibility Card
        const isBusy = timeConstraints.isBusy;
        this.timeFeasibilityVal.textContent = isBusy ? "Time-Restricted" : "Feasible";
        this.timeFeasibilityDesc.textContent = timeConstraints.reason;
        this.timeFeasibilityCard.className = "metric-card " + (isBusy ? "warning" : "feasible");

        // Render Recipes
        this.renderRecipe('breakfast', json.meal_plan.breakfast);
        this.renderRecipe('lunch', json.meal_plan.lunch);
        this.renderRecipe('dinner', json.meal_plan.dinner);

        // Grocery Checklist
        this.groceryListContainer.innerHTML = '';
        if (json.grocery_list && json.grocery_list.length > 0) {
            json.grocery_list.forEach(g => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'grocery-item';
                
                const left = document.createElement('div');
                left.className = 'grocery-item-left';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'grocery-checkbox';
                checkbox.id = `checkbox_${g.item.replace(/\s+/g, '_')}`;
                
                const name = document.createElement('span');
                name.className = 'grocery-name';
                name.textContent = g.item;
                
                left.appendChild(checkbox);
                left.appendChild(name);
                
                if (g.is_pantry_staple) {
                    const badge = document.createElement('span');
                    badge.className = 'pantry-badge';
                    badge.textContent = 'Pantry';
                    left.appendChild(badge);
                    checkbox.checked = true;
                }
                
                const cost = document.createElement('span');
                cost.className = 'grocery-cost';
                cost.textContent = g.is_pantry_staple ? "$0.00" : `$${g.estimated_cost_usd.toFixed(2)}`;
                
                itemDiv.appendChild(left);
                itemDiv.appendChild(cost);
                this.groceryListContainer.appendChild(itemDiv);
            });
        } else {
            this.groceryListContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No groceries needed.</p>';
        }

        // Smart Substitutions Table
        this.subsTableBody.innerHTML = '';
        if (json.smart_substitutions && json.smart_substitutions.length > 0) {
            json.smart_substitutions.forEach(s => {
                const row = document.createElement('tr');
                
                const originalTd = document.createElement('td');
                originalTd.style.fontWeight = '600';
                originalTd.textContent = s.original_needed;
                
                const alternativeTd = document.createElement('td');
                alternativeTd.style.color = 'var(--success)';
                alternativeTd.style.fontWeight = '600';
                alternativeTd.textContent = s.alternative;
                
                const reasonTd = document.createElement('td');
                reasonTd.className = 'subs-reason';
                reasonTd.textContent = s.reason;
                
                row.appendChild(originalTd);
                row.appendChild(alternativeTd);
                row.appendChild(reasonTd);
                this.subsTableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.style.textAlign = 'center';
            td.style.color = 'var(--text-muted)';
            td.textContent = 'No dietary or cost substitutions required.';
            row.appendChild(td);
            this.subsTableBody.appendChild(row);
        }
    }

    renderRecipe(id, recipe) {
        const timeEl = document.getElementById(`${id}Time`);
        const nameEl = document.getElementById(`${id}Name`);
        const instEl = document.getElementById(`${id}Instructions`);

        if (recipe) {
            timeEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${recipe.prep_time_mins}m`;
            nameEl.textContent = recipe.name;
            instEl.innerHTML = '';
            recipe.instructions.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                instEl.appendChild(li);
            });
        }
    }

    copyJsonToClipboard() {
        const jsonText = this.jsonOutputView.textContent;
        navigator.clipboard.writeText(jsonText)
            .then(() => {
                this.copyJsonBtn.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> Copied!';
                setTimeout(() => {
                    this.copyJsonBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy JSON';
                }, 2000);
            })
            .catch(err => {
                console.error("Clipboard copy failed: ", err);
            });
    }
}

// Instantiate App on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SmartChefApp();
});
