import {EnemySpawner}  from "_Scripts/enemy_scripts/EnemySpawner";
import { RectangleButton } from '../../_Packages/SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
/// <reference path="./web-facing/Refer_to_DB.d.ts" />

import { DatabaseComms } from '../web-facing/DatabaseComms';

@component
export class PlayerHealth extends BaseScriptComponent {
    health: number = 3;
    @input
    public enemySpawner: EnemySpawner

    @input infoText: Text;

    @input startImage: Image

    @input deathImage: Image

    @input
    public startButton: RectangleButton

    @input startText: Text;
    DatabaseComms: DatabaseComms;

    
    death()
    {
        print("You Lost!")
        this.enemySpawner.enabled = false
        this.infoText.text = "YOU LOST! :("

        this.startButton.sceneObject.getParent().getParent().enabled = true;
        this.startText.enabled = true
   
        /*if (!this.DatabaseComms) {
            this.DatabaseComms = this.sceneObject.createComponent(DatabaseComms.getTypeName());
        }
        this.DatabaseComms.set_values(150, 10, getAbsoluteStartTime(), "LOSE" )*/
    }

    revive() 
    {
        this.enemySpawner.enabled = true
        this.health = 3
    }
    
    public takeDamage()
    {
        if(--this.health <= 0){
            this.death()      
            
        } 
    }
}