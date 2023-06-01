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

    // Displays the name
    const displayText = document.createElement("p");
    displayText.innerHTML = "<strong>Name:</strong><br>" + record.display_name;
    resultsContainer.appendChild(displayText);

    const latitude = record.lat;
    const longitude = record.lon;
    const [minLatitude, maxLatitude, minLongitude, maxLongitude] = record.boundingbox;

    // Added Iframe
    const mapContainer = document.createElement("div");
    mapContainer.innerHTML = `
      <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${minLongitude},${minLatitude},${maxLongitude},${maxLatitude}&amp;layer=mapnik" style="border: 1px solid black"></iframe>
      <br/>
      <small><a href="https://www.openstreetmap.org/#map=17/${latitude}/${longitude}">View Larger Map</a></small>
    `;
    resultsContainer.appendChild(mapContainer);

    // Grid Table
    const gridTable = document.createElement("table");
    gridTable.classList.add("grid-table");

    // Type
    const typeRow = document.createElement("tr");
    const typeLabelCell = document.createElement("td");
    typeLabelCell.textContent = "Type";
    const typeValueCell = document.createElement("td");
    typeValueCell.textContent = record.type;
    typeRow.appendChild(typeLabelCell);
    typeRow.appendChild(typeValueCell);
    gridTable.appendChild(typeRow);

    // Class
    const classRow = document.createElement("tr");
    const classLabelCell = document.createElement("td");
    classLabelCell.textContent = "Class";
    const classValueCell = document.createElement("td");
    classValueCell.textContent = record.class;
    classRow.appendChild(classLabelCell);
    classRow.appendChild(classValueCell);
    gridTable.appendChild(classRow);

    // Latitude
    const latitudeRow = document.createElement("tr");
    const latitudeLabelCell = document.createElement("td");
    latitudeLabelCell.textContent = "Latitude";
    const latitudeValueCell = document.createElement("td");
    latitudeValueCell.textContent = record.lat;
    latitudeRow.appendChild(latitudeLabelCell);
    latitudeRow.appendChild(latitudeValueCell);
    gridTable.appendChild(latitudeRow);

    // Longitude
    const longitudeRow = document.createElement("tr");
    const longitudeLabelCell = document.createElement("td");
    longitudeLabelCell.textContent = "Longitude";
    const longitudeValueCell = document.createElement("td");
    longitudeValueCell.textContent = record.lon;
    longitudeRow.appendChild(longitudeLabelCell);
    longitudeRow.appendChild(longitudeValueCell);
    gridTable.appendChild(longitudeRow);

    // BBox Coordinates
    const bboxRow = document.createElement("tr");
    const bboxLabelCell = document.createElement("td");
    bboxLabelCell.textContent = "BBox Coordinates";
    const bboxValueCell = document.createElement("td");
    bboxValueCell.textContent = record.boundingbox.join(", ");
    bboxRow.appendChild(bboxLabelCell);
    bboxRow.appendChild(bboxValueCell);
    gridTable.appendChild(bboxRow);

    resultsContainer.appendChild(gridTable);
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