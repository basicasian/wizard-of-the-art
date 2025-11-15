import { Snap3D } from "./3DGeneration/Snap3D";
import { Snap3DTypes } from "./3DGeneration/Snap3DTypes";

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

    private avaliableToRequest: boolean = true;

    private loaderSpinnerImage: SceneObject;
    private baseMeshSpinner: SceneObject;
    private refinedMeshSpinner: SceneObject;

    private baseMeshSceneObject: SceneObject = null;
    private refinedMeshSceneObject: SceneObject = null;

    @input
    baseMeshRoot: SceneObject;

    @input
    modelMat: Material;

    private Gestures: GestureType[] = []
    private Spells: Dictionary<Snap3DTypes.GltfAssetData> = {}
    private SpellModels: Dictionary<SceneObject> = {}
    private SpellsMats: Dictionary<SceneObject> = {}

    private SpellCombos: string[] =
        [
            'Water', 
            /*'Water', 'Wind',
            'Fire Water', 'Water Fire',
            'Fire Wind', 'Wind Fire',
            'Water Wind', 'Wind Water',*/
        ]


    onAwake() {
        this.Init();
    }
    public Init() {  
        // TODO: CHANGE
        for (let i = 0; i < this.SpellCombos.length; i++) 
            {
               
                this.ConsumePrompt(this.SpellCombos[i]);
                print(this.SpellCombos[i])       
            }

        print(getLength(this.Spells))
    }

    private ConsumePrompt(name : string)
    {
         let prompt = 'Generate a 3d model of a spell representing ' + name +
                ' with vibrant colors and dynamic shapes, suitable for a fantasy game. The spell should visually convey the essence of ' + name + 
                ', featuring elements that symbolize its power and nature. The design should be captivating, making it a standout magical effect in any game environment.';
        print(prompt)
        Snap3D.submitAndGetStatus({     
            prompt: prompt,
            format: "glb",
            refine: true,
            use_vertex_color: true,
        })
            .then((submitGetStatusResults) => {
                submitGetStatusResults.event.add(([value, assetOrError]) => {
                    print (value)
                    if (value === "base_mesh") { 
                        this.addBaseMeshAsset(name,
                            assetOrError as Snap3DTypes.GltfAssetData
                        );
                    } else if (value === "refined_mesh") {
                        //     this.generateRefinedMeshAsset(
                        //         assetOrError as Snap3DTypes.GltfAssetData
                        //     );
                    } else if (value === "failed") {
                        this.enableSpinners(false);
                        let error = assetOrError as {
                            errorMsg: string;
                            errorCode: number;
                        };
                        print(
                            "Task failed with error: " +
                            error.errorMsg +
                            " (Code: " +
                            error.errorCode +
                            ")"
                        );
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

                this.avaliableToRequest = true;
            });        
    }
    


    private addBaseMeshAsset(name: string, gltfAssetData: Snap3DTypes.GltfAssetData) {
        addEntry(this.Spells, name, gltfAssetData);
        print("added entry")
        print(getLength(this.Spells))
        


        // TODO: for now immediately generate
        this.generateBaseMeshAsset("Water")
    }

    private generateBaseMeshAsset(name :string) 
    {
        print("basemesh:" + name)

        let gltfAssetData = this.Spells[name]
        // TODO: choose one from spells
        
        print("basemesh:" + 1)
        print(gltfAssetData)


        this.baseMeshSceneObject = gltfAssetData.gltfAsset.tryInstantiate(
            this.baseMeshRoot,
            this.modelMat
        );
        //let material :Material;

        //gltfAssetData.gltfAsset.tryInstantiateAsync(null, material, (result) => {addEntry(this.SpellModels, name, result)},
        //    (error) => {print(error)}, (progress) => {print(progress)} )
        //let spellModel = this.baseMeshSceneObject

         
        print("basemesh:" + 2)
         //this.baseMeshRoot.enabled = false;
        //addEntry(this.SpellModels, name, spellModel);

        
        print("basemesh:" + 3)
        // this.baseMeshSpinner.enabled = false;
    }


    private enableSpinners(enable: boolean) {
        this.loaderSpinnerImage.enabled = enable;
        this.baseMeshSpinner.enabled = enable;
        this.refinedMeshSpinner.enabled = enable;
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

    public shootSpell() {
        let prompt = this.validateGestures();

    }
}

