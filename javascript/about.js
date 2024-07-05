
// Processes the Education Process Section
function processTarget(data, timeLine) {
    // Get the timeline container
    const originalSelector = timeLine.querySelector('.timeline_selector');
    const originalYear = timeLine.querySelector('.timeline_year');
    const originalData = timeLine.querySelector('.timeline_left_data');
    const originalDivider = timeLine.querySelector('.timeline_divider');

    // Update the cloned elements with data from the JSON
    for (const educationData of data) {
        // Clone the timeline_year and timeline_left_data elements
        const clonedSelector = originalSelector.cloneNode(true);
        const clonedYearStart = clonedSelector.querySelector('.timeline_year');
        const clonedData = clonedSelector.querySelector('.timeline_left_data');
        const clonedYearEnd = clonedYearStart.cloneNode(true);
        const clonedDidider = clonedSelector.querySelector('.timeline_divider');

        const title = educationData.Title;
        const fromDate = educationData.FromDate;
        const toDate = educationData.ToDate;

        // Update the cloned year element
        clonedYearStart.textContent = fromDate;
        clonedYearEnd.textContent = toDate;

        // Update the cloned data element
        const clonedImage = clonedData.querySelector('img');
        const clonedTitle = clonedData.querySelector('p');
        clonedImage.src = educationData.Image;
        clonedImage.alt = educationData.ImageAlt;
        clonedTitle.textContent = title;

        // Append the cloned elements to the education timeline
        timeLine.appendChild(clonedSelector);
        clonedSelector.appendChild(clonedYearEnd);

        // Check if this is the last education item
        const isLastItem = educationData === data[data.length - 1];
        if (!isLastItem) {
            timeLine.appendChild(clonedDidider);
        }
        else {
            clonedSelector.removeChild(clonedDidider);
        }

    }

    // Remove the original reference elements
    timeLine.removeChild(originalSelector);
}

function educationProcess(eduData) {
    const educationTimeline = document.getElementById('educationTimeline');
    processTarget(eduData, educationTimeline)
}

function workProcess(workData) {
    const workExperienceTimeline = document.getElementById('workTimeline');
    processTarget(workData, workExperienceTimeline)
}

// Fetches data for the page
fetch('../data/aboutData.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(jsonData => {
        if (jsonData) {
            educationProcess(jsonData.Education)
            workProcess(jsonData.WorkExperience)
        }
    })
    .catch(error => {
        console.error('Error reading or processing JSON file:', error);
    });
