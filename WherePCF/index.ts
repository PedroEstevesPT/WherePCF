import { IInputs, IOutputs } from "./generated/ManifestTypes";
import axios from "axios";

export class WherePCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    updateView(context: ComponentFramework.Context<IInputs>): void {
        throw new Error("Method not implemented.");
    }
    private streetName: string;
    private label: HTMLLabelElement;
    private recordCount: number;
    private currentIndex: number;
    private searchData: any[];

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Create the label element
        this.label = document.createElement("label");
        this.label.innerText = "WherePCF";
        container.appendChild(this.label);

        // Create the input element
        const input = document.createElement("input");
        input.type = "text";
        input.addEventListener("input", this.handleInputChange.bind(this));
        input.addEventListener("keydown", this.handleEnterKey.bind(this));
        container.appendChild(input);

        // Create the container for displaying results
        const resultsContainer = document.createElement("div");
        resultsContainer.id = "results-container";
        container.appendChild(resultsContainer);
    }

    private handleInputChange(event: Event) {
        this.streetName = (event.target as HTMLInputElement).value;
    }

    private handleEnterKey(event: KeyboardEvent) {
        if (event.key === "Enter") {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.streetName)}&format=json`;

            axios
                .get(url)
                .then((response) => {
                    

                    if (response.status === 200) {
                        this.searchData = response.data;
                        this.recordCount = this.searchData.length;
                        this.currentIndex = 0;
                        this.displayRecord(this.searchData[this.currentIndex]);
                        console.log(response.data);
                    }
                })
                .catch((error) => {
                    // Handle any errors
                });
        }
    }

    private displayRecord(record: any) {
        const resultsContainer = document.getElementById("results-container");
        if (resultsContainer) {
            resultsContainer.innerHTML = "";

            const recordCountLabel = document.createElement("label");
            recordCountLabel.innerText = `Result ${this.currentIndex + 1} of ${this.recordCount}`;
            resultsContainer.appendChild(recordCountLabel);

            //Displays the name
            const displayText = document.createElement("p");
            displayText.innerText = record.display_name;
            resultsContainer.appendChild(displayText);

            //Display type
            const typeText = document.createElement("p");
            typeText.innerText = "Type:" + record.type;
            resultsContainer.appendChild(typeText);

            //Display class
            const classText = document.createElement("p");
            classText.innerText = "Class:" + record.class;
            resultsContainer.appendChild(classText);

            //Display Latitude
            const latitudeText = document.createElement("p");
            latitudeText.innerText = "Latitude:" + record.lat;
            resultsContainer.appendChild(latitudeText);            

            //Display Longitude
            const longitudeText = document.createElement("p");
            longitudeText.innerText = "Longitude:" + record.lon;
            resultsContainer.appendChild(longitudeText);    

            //Display Bounding box coordinates
            const boundingboxText = document.createElement("p");
            boundingboxText.innerText = "Bounding box coordinates:" + record.boundingbox;
            resultsContainer.appendChild(boundingboxText);    
            


            const previousButton = document.createElement("button");
            previousButton.innerText = "Previous";
            previousButton.addEventListener("click", this.handlePreviousButtonClick.bind(this));
            resultsContainer.appendChild(previousButton);

            const nextButton = document.createElement("button");
            nextButton.innerText = "Next";
            nextButton.addEventListener("click", this.handleNextButtonClick.bind(this));
            resultsContainer.appendChild(nextButton);
        }
    }

    private handlePreviousButtonClick() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.displayRecord(this.searchData[this.currentIndex]);
        }
    }

    private handleNextButtonClick() {
        if (this.currentIndex < this.recordCount - 1) {
            this.currentIndex++;
            this.displayRecord(this.searchData[this.currentIndex]);
        }
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Clean up any resources
    }
}