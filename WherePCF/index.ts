import { IInputs, IOutputs } from "./generated/ManifestTypes";
import axios from "axios";
import "./styles.css";

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
            recordCountLabel.innerHTML = `Result ${this.currentIndex + 1} of ${this.recordCount} <br>`;
            resultsContainer.appendChild(recordCountLabel);


            const previousButton = document.createElement("button");
            previousButton.innerText = "Previous";
            previousButton.addEventListener("click", this.handlePreviousButtonClick.bind(this));
            resultsContainer.appendChild(previousButton);

            const nextButton = document.createElement("button");
            nextButton.innerText = "Next";
            nextButton.addEventListener("click", this.handleNextButtonClick.bind(this));
            resultsContainer.appendChild(nextButton);

            //https://www.openstreetmap.org/#map=13/9.0940/-65.9213


            //Displays the name
            const displayText = document.createElement("p");
            displayText.innerHTML = "<strong>Name:</strong><br>" + record.display_name;
            resultsContainer.appendChild(displayText);

            console.log(record);


            const latitude = record.lat;
            const longitude = record.lon;
            const [minLatitude, maxLatitude, minLongitude, maxLongitude] = record.boundingbox;



            //Added Iframe
            const mapContainer = document.createElement("div");            
            mapContainer.innerHTML = `
                <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=${minLongitude},${minLatitude},${maxLongitude},${maxLatitude}&amp;layer=mapnik" style="border: 1px solid black"></iframe>
                <br/>
                <small><a href="https://www.openstreetmap.org/#map=17/${latitude}/${longitude}">View Larger Map</a></small>
            ;`

            console.log("will print mapContainer");
            console.log(mapContainer);

            resultsContainer.appendChild(mapContainer);

            //Display type
            const typeText = document.createElement("p");
            typeText.innerHTML = "<strong>Type:</strong><br> " + record.type;
            typeText.classList.add("resultItem");
            resultsContainer.appendChild(typeText);

            //Display class
            const classText = document.createElement("p");
            classText.innerHTML = "<strong>Class:</strong><br> " + record.class;
            resultsContainer.appendChild(classText);

            //Display Latitude
            const latitudeText = document.createElement("p");
            latitudeText.innerHTML = `<strong>Latitude:</strong><br>${latitude}`;
            resultsContainer.appendChild(latitudeText);            

            //Display Longitude
            const longitudeText = document.createElement("p");
            longitudeText.innerHTML = `<strong>Longitude:</strong><br>${longitude}`;
            resultsContainer.appendChild(longitudeText);    

            //Display Bounding box coordinates
            const boundingboxText = document.createElement("p");
            boundingboxText.innerHTML = `<strong>BBox Coordinates:</strong><br>` + record.boundingbox;
            resultsContainer.appendChild(boundingboxText);    
        
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