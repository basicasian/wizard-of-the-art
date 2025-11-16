
   class GameData {
        projectile_speed: number;
        spawn_frequency: number;
        enemy_hp: number;
        enemy_spells_cast: number;
        game_duration_seconds: number;
        outcome: string;

        constructor(
            projectile_speed: number,
            spawn_frequency: number,
            enemy_hp: number,
            enemy_spells_cast: number,
            game_duration_seconds: number,
            outcome: string
        ) {
            this.projectile_speed = projectile_speed;
            this.spawn_frequency = spawn_frequency;
            this.enemy_hp = enemy_hp;
            this.enemy_spells_cast = enemy_spells_cast;
            this.game_duration_seconds = game_duration_seconds;
            this.outcome = outcome;
        }
    }
@component
export class DatabaseComms extends BaseScriptComponent{
    // --- Supabase Configuration ---
    SUPABASE_URL = "https://jgvxofszpjdfdoyktyyx.supabase.co";
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndnhvZnN6cGpkZmRveWt0eXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzg1MTksImV4cCI6MjA3ODc1NDUxOX0.GVEqYACF664GLuyvlcgqGavs8KLN77MzOe_ETscNV1o"; 
    TABLE_NAME = "GameSessions";
    MAX_ENTRIES_PER_USER = 50;

    SUPABASE_HEADERS = {
    'apikey': this.SUPABASE_KEY,
  ' Authorization': `Bearer ${this.SUPABASE_KEY}`,
  ' Content-Type': 'application/json',
    };

    @input 
    public internetModule : InternetModule;
    TEST_USER_ID = "dc2f75d8-2e56-47b3-a557-c43541673ec1"; // User: Sir-Farts-A-Lot -- no judge plis :)

    public set_values(projSpeed: number, spawnFreq: number, secs: number, result: string)
    {
        const game_data = new GameData(projSpeed, spawnFreq, 1, 0, secs, result);

        this.write_to_db(this.TEST_USER_ID, game_data);
    }

    private async write_to_db(userId: string, gameData: GameData): Promise<any | null> {
        print(`Attempting to write new entry for user ${userId}...`);

        const countUrl = `${this.SUPABASE_URL}/rest/v1/${this.TABLE_NAME}?select=count&user_id=eq.${userId}`;
        const countRequest = new Request(countUrl, {
            method: 'GET',
            headers: { ...this.SUPABASE_HEADERS, 'Accept': 'application/vnd.pgrst.object+json' }
        });

        try {
            const countResponse = await this.internetModule.fetch(countRequest);
            if (!countResponse.ok) throw new Error(`Count request failed: ${countResponse.status}`);
            const countBody: any = await countResponse.json();
            const count = typeof countBody.count === 'string' ? parseInt(countBody.count, 10) : countBody.count || 0;
            print(`User currently has ${count} entries.`);

            if (count >= this.MAX_ENTRIES_PER_USER) {
                const numToDelete = count - this.MAX_ENTRIES_PER_USER + 1;
                print(`Entry limit reached. Deleting ${numToDelete} oldest entries...`);

                const pkColumnName = 'session_id';
                const getOldestUrl = `${this.SUPABASE_URL}/rest/v1/${this.TABLE_NAME}?select=${pkColumnName}&user_id=eq.${userId}&order=created_at.asc&limit=${numToDelete}`;
                const oldestRequest = new Request(getOldestUrl, { method: 'GET', headers: this.SUPABASE_HEADERS });
                const oldestResponse = await this.internetModule.fetch(oldestRequest);

                if (oldestResponse.ok) {
                    const entriesToDelete: any[] = await oldestResponse.json();
                    const idsToDelete = entriesToDelete.map(entry => entry[pkColumnName]);
                    if (idsToDelete.length > 0) {
                        // Quote string IDs for the `in.(...)` operator
                        const quotedIds = idsToDelete.map((id: any) => `"${id}"`).join(',');
                        const deleteUrl = `${this.SUPABASE_URL}/rest/v1/${this.TABLE_NAME}?${pkColumnName}=in.(${quotedIds})`;
                        const deleteRequest = new Request(deleteUrl, { method: 'DELETE', headers: this.SUPABASE_HEADERS });
                        await this.internetModule.fetch(deleteRequest);
                    }
                }
            }
        } catch (error) {
            print(`[CRITICAL ERROR] Exception during entry count/delete phase: ${error}`);
            return null;
        }

        const insertUrl = `${this.SUPABASE_URL}/rest/v1/${this.TABLE_NAME}`;
        const insertRequest = new Request(insertUrl, {
            method: 'POST',
            headers: { ...this.SUPABASE_HEADERS, 'Prefer': 'return=representation' },
            body: JSON.stringify({ ...gameData, user_id: userId }),
        });

        try {
            const response = await this.internetModule.fetch(insertRequest);
            if (response.status === 201 || response.status === 200) {
                const newEntry = await response.json();
                print("Successfully wrote new entry to DB.");
                return Array.isArray(newEntry) ? newEntry[0] : newEntry;
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
}