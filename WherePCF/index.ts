import {IInputs, IOutputs} from "./generated/ManifestTypes";
import axios from "axios";

export class WherePCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    updateView(context: ComponentFramework.Context<IInputs>): void {
        throw new Error("Method not implemented.");
    }

    private streetName: string;
    private label: HTMLLabelElement;

    /**
     * Used to initialize the control instance.
     * @param context The entire property bag available to control via Context Object.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Create the label element
        this.label = document.createElement("label");
        this.label.innerText = "Street Name";
        container.appendChild(this.label);

        // Create the input element
        const input = document.createElement("input");
        input.type = "text";
        input.addEventListener("input", this.handleInputChange.bind(this));
        input.addEventListener("keydown", this.handleEnterKey.bind(this));
        container.appendChild(input);
    }

    private handleInputChange(event: Event) {
        this.streetName = (event.target as HTMLInputElement).value;
    }

    private handleEnterKey(event: KeyboardEvent) {
        if (event.key === "Enter") {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.streetName)}&format=json`;

            axios.get(url)
                .then(response => {
                    // Handle the API response data
                })
                .catch(error => {
                    // Handle any errors
                });
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     */
    public destroy(): void {
        // Clean up any resources
    }
}