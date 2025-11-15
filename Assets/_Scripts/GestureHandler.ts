import { Snap3D } from "./3DGeneration/Snap3D";
import { Snap3DTypes } from "./3DGeneration/Snap3DTypes";
import { RectangleButton } from '../_Packages/SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton';
import { SpellMovement } from "./SpellMovement";
enum GestureType {
    Target,
    PinchLeft,
    PinchRight,
    GrabLeft,
    GrabRight,
    Phone
}

enum GestureValidationResult {
    Invalid,
    Fire,
    Wind,
    Water
}
interface Dictionary<T> {
    [key: string]: T;
}

const addEntry = <T,>(dict: Dictionary<T>, key: string, value: T): void => {
    dict[key] = value;
    // ensure getLength stays accurate by (re)assigning it
};



// standalone helper if you prefer not to rely on the optional method
const getLength = <T,>(dict: Dictionary<T>): number => {
    return Object.keys(dict).length;
};

@component
export class GestureHandler extends BaseScriptComponent
// export abstract class GestureManager 
{
    @input
    @widget(new TextAreaWidget())
    private prompt: string = "A cute dog wearing a hat";

    @input
    private refineMesh: boolean = true;

    @input
    private useVertexColor: boolean = false;

    @input
    hintText: Text;

    @input
    public startButton: RectangleButton;

    @input
    public startText: Text;


    private avaliableToRequest: boolean = true;

    //private loaderSpinnerImage: SceneObject;
    private baseMeshSpinner: SceneObject;
    private refinedMeshSpinner: SceneObject;

    private baseMeshSceneObject: SceneObject = null;
    private refinedMeshSceneObject: SceneObject = null;

    @input
    imageRoot: Image;

    @input
    baseMeshRoot: SceneObject;

    @input
    refinedMeshRoot: SceneObject

    @input
    modelMat: Material;

    private Gestures: GestureType[] = []
    private Spells: Dictionary<Snap3DTypes.GltfAssetData> = {}

    private SpellModels: Dictionary<SceneObject> = {}
    private SpellsMats: Dictionary<SceneObject> = {}



    private SpellCombos: string[] =
        [
            'Water', 'Wind', 'Fire'/*
            'Fire Water', 'Water Fire',
            'Fire Wind', 'Wind Fire',
            'Water Wind', 'Wind Water',*/
        ]


    onAwake() {
        this.startButton.enabled = false;
        this.startText.text = "Please Wait.. Generating Assets";

        const promises: Promise<boolean>[] = this.SpellCombos.map((combo) => {
            print(combo);
            return this.ConsumePrompt(combo);
        });

        Promise.all(promises)
            .then((results) => {
            print("All assets generated: " + results.length);
            this.startButton.enabled = true;
            this.startText.text = "Start Game";

            })
            .catch((err) => {
            print("One or more generations failed: " + err);
            this.startButton.enabled = false;
            this.startText.text = "Generation Failed. Please Restart App.";
            });


        print("DONE, length: " + getLength(this.Spells))
    }

    private ConsumePrompt(name: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
        let prompt = 'Generate a 3d model of a spell representing ' + name +
            ' with vibrant colors and dynamic shapes, suitable for a fantasy game. The spell should visually convey the essence of ' + name +
            ', featuring elements that symbolize its power and nature. The design should be captivating, making it a standout magical effect in any game environment.';
        print(prompt)
        Snap3D.submitAndGetStatus({
            prompt: prompt,
            format: "glb",
            refine: true,
            use_vertex_color: false,
        })
            .then((submitGetStatusResults) => {
                submitGetStatusResults.event.add(([value, assetOrError]) => {
                    print(value)
                    print(assetOrError)
                    // if (value === "image") {
                    //             this.generateImageAsset(
                    //               assetOrError as Snap3DTypes.TextureAssetData
                    //             );
                    //           }
                    if (value === "base_mesh") {
                        this.addBaseMeshAsset(name,
                            assetOrError as Snap3DTypes.GltfAssetData
                        );
                        resolve(true)
                        // } else if (value === "refined_mesh") {
                        //          this.generateRefinedMeshAsset(
                        //              assetOrError as Snap3DTypes.GltfAssetData
                        //          );
                    } else if (value === "failed") {
                        let error = assetOrError as {
                            errorMsg: string;
                            errorCode: number;
                        };
                        reject(false)
                        print(
                            "Task failed with error: " +
                            error.errorMsg +
                            " (Code: " +
                            error.errorCode +
                            ")"
                        );
                        //this.enableSpinners(false);

                        this.hintText.text =
                            "Generation failed. Please Tap or Pinch to try again.";

                        this.avaliableToRequest = true;
                    }
                });
            })
            .catch((error) => {
                this.hintText.text =
                    "Generation failed. Please Tap or Pinch to try again.";
                print("Error submitting task or getting status: " + error);
                                        reject(false)

                this.avaliableToRequest = true;
            });
        })
    }


    private addBaseMeshAsset(name: string, gltfAssetData: Snap3DTypes.GltfAssetData) {
        addEntry(this.Spells, name, gltfAssetData);
        print("added entry")
        print(getLength(this.Spells))

        // TODO: for now immediately generate
        this.generateBaseMeshAsset(name)
    }

    private generateImageAsset(textureAssetData: Snap3DTypes.TextureAssetData) {
        this.imageRoot.mainPass.baseTex = textureAssetData.texture;
        //this.loaderSpinnerImage.enabled = false;
        //this.imageRoot.enabled = true;
    }


    private generateRefinedMeshAsset(gltfAssetData: Snap3DTypes.GltfAssetData) {
        this.refinedMeshSceneObject = gltfAssetData.gltfAsset.tryInstantiate(
            this.refinedMeshRoot,
            this.modelMat.clone()
        );
        //this.refinedMeshSpinner.enabled = false;

        this.hintText.text =
            "Generation Completed. Please Tap or Pinch to try again.";

        this.avaliableToRequest = true;
    }

    private generateBaseMeshAsset(name: string) {
        print("basemesh:" + name)

        let gltfAssetData = this.Spells[name]
        // TODO: choose one from spells

        print("basemesh:" + 1)
        print(gltfAssetData)

        let sceneObject = gltfAssetData.gltfAsset.tryInstantiate(
            this.baseMeshRoot,
            this.modelMat.clone()
        );
        sceneObject.enabled = false;
        addEntry(this.SpellModels, name, sceneObject);
    }


    public getSpellObject(name: string, position: vec3) {
        let test = global.scene.createSceneObject(name)
        print(JSON.stringify(this.Spells))
        let tempObj = this.Spells[name].gltfAsset.tryInstantiate (
            test,
            this.modelMat.clone()
        );

        let rndScale = Math.floor(Math.random() * (40 - 30 + 1) + 30);
        tempObj.getTransform().setWorldScale(vec3.one().uniformScale(rndScale))
        let rot1 = Math.random
        tempObj.getTransform().setWorldRotation(this.RandomRotation())
        tempObj.getTransform().setWorldPosition(position)
        tempObj.enabled = true
        return tempObj;
    }

    private RandomRotation () : quat
    {
        let x = Math.random() * 360
        let y = Math.random() * 360
        let z = Math.random() * 360
        return quat.fromEulerAngles(x,y,z)
    }
    
    private GenerateMesh() { }
    public addGesture(type: GestureType) {
        this.Gestures.push(type);
    }

    private validateGestures(): string {
        const results: GestureValidationResult[] = [];
        for (let i = 0; i < this.Gestures.length; i++) {
            let gesture = this.Gestures[i];
            if (gesture.toString().includes("Pinch"))
                results.push(GestureValidationResult.Fire);
            else if (gesture.toString().includes("Grab"))
                results.push(GestureValidationResult.Water);
            else if (gesture.toString().includes("Phone"))
                results.push(GestureValidationResult.Wind);
        }

        let prompt: string = "";
        for (let i = 0; i < results.length; i++) {
            prompt += results[i].toString();
        }

        return prompt;
    }

    public IsDone(): boolean {
        
        var length =  Object.keys(this.SpellModels).length
        const isDone = length > 0
        print("IsDone: " + isDone)
        return isDone
    }
}

