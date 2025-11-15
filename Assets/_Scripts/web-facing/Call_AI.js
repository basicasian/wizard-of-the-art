//@input Asset.InternetModule internetModule
/** @type {InternetModule} */
var internetModule = script.internetModule;

// --- API Configuration ---
const API_KEY = 'sk-9dab15ceb48a4be88bce60fb2fbc7e8e';
const COMPLETION_URL = 'https://chat-dev.shipreality.com/api/chat/completions';
const MODEL = 'gpt-oss:latest';

// --- API Headers ---
const API_HEADERS = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
};

// --- System Prompt for the AI Game Master ---
const SYSTEM_PROMPT = `
You are an AI Game Master for an AR wizard duel. Your goal is to balance game difficulty.
You have two modes. Based on the user's input, respond ONLY with the specified JSON format.
    Mode A: Real-time Action
        Input starts with "A)". Describes context and gives numbered options.
        Your Task: Choose an action and set its immediate speed.
        Output: {"CHOICE": number, "SPEED": number}
    Mode B: Difficulty Tuning
        Input is a JSON object with the stats of the previous X games (e.g., {"PROJECTILE_SPEED": 35, "SPAWN_FREQUENCY": 10, "ENEMY_HP": 50, "ENEMY_SPELLS_CAST": 59, "PLAYER_SPELLS_DODGED": 5, "GAME_DURATION": 120, "OUTCOME": "LOST"}).
        Your Task: Analyze the stats to set the difficulty for the NEXT game.
        Aim for a challenging but fair experience.
        Output: {"PROJECTILE_SPEED": number, "SPAWN_FREQUENCY": number, "ENEMY_HP": number}
`;

/**
 * Sends a prompt to the AI Game Master and gets a structured JSON response.
 * @param {string} userPrompt The content for the 'user' role. For Mode B, this should be a JSON string.
 * @returns {Promise<object|null>} A promise that resolves to the parsed JSON object from the AI's response, or null on failure.
 */
async function getAIResponse(userPrompt) {
  let result = null;

  do {
    print(`Sending prompt to AI: ${userPrompt}`);

    if (!internetModule) {
        print("[ERROR] Internet Module is not assigned in the Inspector!");
        break;
    }

    const requestBody = {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 1,
      max_tokens: -1,
      stream: false,
    };

    const request = new Request(COMPLETION_URL, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(requestBody),
    });

    try {
      const response = await internetModule.fetch(request);

      if (response.status !== 200) {
        print(`[ERROR] AI request failed. Status: ${response.status} ${response.statusText}`);
        const errorBody = await response.text();
        print(`[ERROR] Body: ${errorBody}`);
        break;
      }

      const responseData = await response.json();
      const aiContent = responseData && responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content;
      
      if (!aiContent) {
          print("[ERROR] AI response format is unexpected or empty.");
          break;
      }

      print(`AI Raw Response: ${aiContent}`);
      
      try {
        const parsedAIResponse = JSON.parse(aiContent);
        result = parsedAIResponse; // This is the only successful exit point
      } catch (parseError) {
        print(`[CRITICAL ERROR] Failed to parse AI's JSON response: ${parseError}`);
        break;
      }

    } catch (error) {
      print(`[CRITICAL ERROR] Exception during getAIResponse: ${error}`);
      break;
    }
  } while (false);

  return result;
}

/**
 * A test function that runs on start to demonstrate getAIResponse.
 * You can comment out the call to this function in the OnStartEvent binding below.
 */
async function runTest() {
    print("--- STARTING AI TEST ---");

    // --- Test 1: Mode A (Real-time Action) ---
    print("\n[TEST 1] Mode A: Choosing a spell to cast...");
    const modeAPrompt = 'A) Cast a spell. Options: 1) Fireball, 2) Ice Shard, 3) Lightning Bolt. Give me the spell to cast now with a number between 1-3. Then give how fast it will be. Last one was PROJECTILE_SPEED 20 and it was dodged.';
    
    const modeAResponse = await getAIResponse(modeAPrompt);
    if (modeAResponse) {
        print("--- Parsed AI Response (Mode A) ---");
        print(`Choice: ${modeAResponse.CHOICE}`);
        print(`Speed: ${modeAResponse.SPEED}`);
        print("---------------------------------");
    } else {
        print("[TEST 1] Failed to get response for Mode A.");
    }
    
    // --- Test 2: Mode B (Difficulty Tuning) ---
    print("\n[TEST 2] Mode B: Tuning difficulty after a loss...");
    const gameStats = {
        PROJECTILE_SPEED: 30,
        SPAWN_FREQUENCY: 10,
        ENEMY_HP: 50,
        ENEMY_SPELLS_CAST: 59,
        PLAYER_SPELLS_DODGED: 1,
        GAME_DURATION_SECONDS: 21,
        OUTCOME: "LOSE"
    };
    const modeBPrompt = 'B) ' + JSON.stringify(gameStats);

    const modeBResponse = await getAIResponse(modeBPrompt);
    if (modeBResponse) {
        print("--- Parsed AI Response (Mode B) ---");
        print(`New Projectile Speed: ${modeBResponse.PROJECTEOLE_SPEED}`);
        print(`New Spawn Frequency: ${modeBResponse.SPAWN_FREQUENCY}`);
        print(`New Enemy HP: ${modeBResponse.ENEMY_HP}`);
        print("---------------------------------");
    } else {
        print("[TEST 2] Failed to get response for Mode B.");
    }

    print("\n--- AI TEST FINISHED ---");
}

// Bind the test function to the OnStartEvent.
// To disable the automatic test and use getAIResponse in other scripts, comment out this line.
script.createEvent('OnStartEvent').bind(runTest);