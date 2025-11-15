//@input Asset.InternetModule internetModule
/** @type {InternetModule} */
var internetModule = script.internetModule;

// --- Supabase Configuration ---
const SUPABASE_URL = "https://jgvxofszpjdfdoyktyyx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndnhvZnN6cGpkZmRveWt0eXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzg1MTksImV4cCI6MjA3ODc1NDUxOX0.GVEqYACF664GLuyvlcgqGavs8KLN77MzOe_ETscNV1o"; 
const TABLE_NAME = "GameSessions";
const MAX_ENTRIES_PER_USER = 50;

const SUPABASE_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};


const TEST_USER_ID = "dc2f75d8-2e56-47b3-a557-c43541673ec1"; // User: Sir-Farts-A-Lot -- no judge plis :)
const TEST_GAME_DATA = {
    projectile_speed: 35.5,
    spawn_frequency: 10.2,
    enemy_hp: 50,
    enemy_spells_cast: 59,
    player_spells_dodged: 5,
    game_duration_seconds: 120,
    outcome: "LOSE"
};


/**
 * Reads the last <amount> of game sessions for a specific user.
 */
async function read_from_db(userId, amount) {
  print(`Reading last ${amount} entries for user ${userId}...`);
  const url = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*&user_id=eq.${userId}&order=created_at.desc&limit=${amount}`;

  let request = new Request(url, {
    method: 'GET',
    headers: SUPABASE_HEADERS,
  });

  try {
    const response = await internetModule.fetch(request);
    if (response.status === 200) {
      const data = await response.json();
      print(`Successfully read ${data.length} entries.`);
      return data;
    } else {
      print(`[ERROR] Failed to read from DB. Status: ${response.status}`);
      print(`[ERROR] Body: ${await response.text()}`);
      return null;
    }
  } catch (error) {
    print(`[CRITICAL ERROR] Exception during read_from_db: ${error}`);
    return null;
  }
}

/**
 * Writes a new game session to the database for a specific user.
 */
async function write_to_db(userId, gameData) {
  print(`Attempting to write new entry for user ${userId}...`);

  const countUrl = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=count&user_id=eq.${userId}`;
  const countRequest = new Request(countUrl, {
      method: 'GET',
      headers: {...SUPABASE_HEADERS, 'Accept': 'application/vnd.pgrst.object+json' }
  });

  try {
      const countResponse = await internetModule.fetch(countRequest);
      if (!countResponse.ok) throw new Error(`Count request failed: ${countResponse.status}`);
      const { count } = await countResponse.json();
      print(`User currently has ${count} entries.`);

      if (count >= MAX_ENTRIES_PER_USER) {
          const numToDelete = count - MAX_ENTRIES_PER_USER + 1;
          print(`Entry limit reached. Deleting ${numToDelete} oldest entries...`);
          
          const pkColumnName = 'session_id';
          const getOldestUrl = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=${pkColumnName}&user_id=eq.${userId}&order=created_at.asc&limit=${numToDelete}`;
          const oldestRequest = new Request(getOldestUrl, { method: 'GET', headers: SUPABASE_HEADERS });
          const oldestResponse = await internetModule.fetch(oldestRequest);
          
          if (oldestResponse.status === 200) {
              const entriesToDelete = await oldestResponse.json();
              const idsToDelete = entriesToDelete.map(entry => entry[pkColumnName]);
              const deleteUrl = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?${pkColumnName}=in.(${idsToDelete.join(',')})`;
              const deleteRequest = new Request(deleteUrl, { method: 'DELETE', headers: SUPABASE_HEADERS });
              await internetModule.fetch(deleteRequest);
          }
      }
  } catch(error) {
      print(`[CRITICAL ERROR] Exception during entry count/delete phase: ${error}`);
      return null;
  }
  
  const insertUrl = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}`;
  const insertRequest = new Request(insertUrl, {
    method: 'POST',
    headers: { ...SUPABASE_HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify({ ...gameData, user_id: userId }),
  });

  try {
    const response = await internetModule.fetch(insertRequest);
    if (response.status === 201) {
      const newEntry = await response.json();
      print("Successfully wrote new entry to DB.");
      return newEntry[0];
    } else {
      print(`[ERROR] Failed to write to DB. Status: ${response.status}`);
      print(`[ERROR] Body: ${await response.text()}`);
      return null;
    }
  } catch (error) {
    print(`[CRITICAL ERROR] Exception during write_to_db: ${error}`);
    return null;
  }
}

async function runTest() {
    print("--- STARTING DATABASE TEST ---");

    // Test 1: Read the last 5 entries for "Sir-Farts-A-Lot".
    print("\n[TEST 1] Reading existing data...");
    const existingData = await read_from_db(TEST_USER_ID, 5);
    if (existingData) {
        print(`--- Last 5 Entries for ${TEST_USER_ID} ---`);
        print(JSON.stringify(existingData, null, 2));
        print("----------------------------------");
    }
    
    // Test 2: Write one new entry for "Sir-Farts-A-Lot".
    print("\n[TEST 2] Writing new data...");
    const newEntry = await write_to_db(TEST_USER_ID, TEST_GAME_DATA);
    if (newEntry) {
        print("--- Successfully Created New Entry ---");
        print(JSON.stringify(newEntry, null, 2));
        print("--------------------------------------");
    }

    print("\n--- DATABASE TEST FINISHED ---");
}

// Bind the test function to the OnStartEvent.
script.createEvent('OnStartEvent').bind(runTest);