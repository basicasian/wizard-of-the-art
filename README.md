# Wizard of ARt  

**Wizard of ARt** is an immersive AR spell-casting game created during **Hackathon Junction 2025** in under 48 hours.  
You play as a wizard devoted to **AI-generated magic** and **augmented reality**, tasked with fighting against human-made memes, such as Pepes, by casting dynamically generated spells using hand gestures.

<p align="middle">
  <img src="wizard-of-arts.png" alt="Gameplay Mockup" width="60%"/> 
</p>

**Creators:** The Bulbarians: Renate Zhang, Armand Balint, Lucie Nguyen, Orestis Liaskos, Luis Queijo <br>
**Event:** Junction 2025 Hackathon (48-hour prototype)

---

## Project Overview  

Wizard of ARt explores the intersection of **AI-generated 3D content**, **AR immersion**, and **gesture-based interaction**.  
Players use AR glasses to cast spells using natural gestures—pinches, grabs, and directional targeting—while battling waves of meme-shaped enemies.

At startup, the game generates 3D spell models using Snap3D based on AI prompts.  
Hand gestures then summon and launch these spells into the AR world.

### Key Features  
- **AI-Generated Spell Assets** (Fire, Water, etc.)  
- **Gesture-Based Combat**  
- **Real-Time AR Projection**  
- **Enemy Waves Based on Human Memes**  
- **Built in <48 hours**

---

## Getting Started  

### Prerequisites  
- **Lens Studio + Spectacles AR SDK**  
- **Snap3D API Key**  
- **Snap AR Device / Spectacles** or emulator  
- (Optional) Junction 2025 hackathon energy

### Installation  
1. Clone the repository.  
2. Open in **Lens Studio**.  
3. Assign script inputs in the Inspector (gesture script, UI, camera, health, spawner…).  
4. Build & deploy to AR glasses.

---

## Gameplay  

### Controls (via AR Hand Tracking)

| Gesture | Effect |
|--------|--------|
| **Left-hand Pinch** | Cast **Water Spell** |
| **Right-hand Grab** | Cast **Fire Spell** |
| **Start Button** | Begin the battle and spawn enemies |

### Objective  
- Survive waves of hostile meme creatures.  
- Use AI spells to destroy enemies.  
- Protect your magical ARt essence from corruption.

---

## File Structure  

```
/WizardOfARt
│
├── Scripts/
│   ├── GestureHandler.ts      # AI spell generation & gesture logic
│   ├── SpellMovement.ts       # Spell projectile physics
│   ├── Targeting.ts           # Gesture → spell casting logic
│   ├── UIHandler.ts           # Start UI, enemy spawn, player health
│   ├── enemy_scripts/
│   │   └── EnemySpawner.ts    # Meme enemy spawning
│   └── Player/
│       └── PlayerHealth.ts    # Player health logic
│
├── Assets/
│   ├── UI/                    # Buttons, texts
│   ├── Models/                # AI-generated spell meshes
│   └── Audio/                 # SFX for spells
│
└── Scenes/
    └── MainLens.lsz           # Main AR game scene
```

---

## Technical Highlights  

### AI-Generated Spell Models  
Powered by **Snap3D**, spell assets are generated dynamically when the game begins.  
Examples:  
- Fire spell model  
- Water spell model  

Each spell model is instantiated, scaled, and positioned in real time.

### Gesture-Driven Casting  
The game listens to pinch and grab events to spawn spell projectiles in the player’s forward direction.

### Spell Physics  
Each spell moves forward with a lifespan timer and collider for interactions.

---

## Status  
- **Playable prototype**  
- **Created in 48 hours**  
- Current limitations:  
  - Only two spells (Fire, Water)  
  - No in-game menu  
  - No scoring  
  - Basic enemy AI

---

## License  
MIT 

---

## Credits  
Built with ❤️ at **Junction 2025**  
Powered by **AR**, **not by AI (ironically we did not use AI to code)**, and **a lot of coffee**.
