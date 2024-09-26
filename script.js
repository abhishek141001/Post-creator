document.addEventListener("DOMContentLoaded", function () {
    const layoutOptions = document.querySelectorAll(".layout-options > div");
    const output = document.getElementById("output");
    const addContentButton = document.getElementById("addContent");
    const captureButton = document.getElementById("capture");
    const imageFileInput = document.getElementById("imageFile");
    const bgImageFileInput = document.getElementById("bgFile");

    let selectedLayout;
    let uploadedImage = null; // Store uploaded image
    let uploadedBgImage = null;

    // Handle layout selection with preview
    layoutOptions.forEach(option => {
        option.addEventListener("click", function () {
            layoutOptions.forEach(opt => opt.classList.remove("selected"));
            this.classList.add("selected"); // Highlight selected layout
            selectedLayout = this.className.split(' ')[0]; // Store selected layout
            updateOutputPreview(selectedLayout);
        });
    });

    // Update output with the preview of the selected layout
    function updateOutputPreview(layout) {
        const layoutContent = document.querySelector(`.${layout}`).cloneNode(true);
        layoutContent.querySelector(".layout-title").innerText = "Your Heading Here";
        layoutContent.querySelector(".layout-description").innerText = "Your description goes here.";
        layoutContent.querySelector(".layout-image").src = "https://via.placeholder.com/150"; // Placeholder image
        
        output.innerHTML = "";
        output.appendChild(layoutContent);

        // Initialize draggable functionality
        makeElementsDraggable(layoutContent);
    }

    // Add content to the selected layout
    addContentButton.addEventListener("click", function () {
        if (!selectedLayout) {
            alert("Please select a layout first.");
            return;
        }

        const heading = document.getElementById("heading").value;
        const paragraph = document.getElementById("paragraph").value;
        const imageUrl = document.getElementById("imageUrl").value;
        const bgImageUrl = document.getElementById("bgImage").value;
        const bgColor = document.getElementById("bgColor").value; // Get selected background color
        const textColor = document.getElementById("textColor").value; // Get selected text color
        const bgPosition = document.getElementById("bgPosition").value; // Get selected background position

        // Replace content in the selected layout
        const layoutContent = output.querySelector(`.${selectedLayout}`);
        layoutContent.querySelector(".layout-title").innerText = heading;
        layoutContent.querySelector(".layout-title").classList.add('draggable-title'); // Make title draggable
        layoutContent.querySelector(".layout-description").innerText = paragraph;
        layoutContent.style.backgroundColor = bgColor; 
        layoutContent.querySelector(".layout-title").style.color = textColor; // Apply text color to title
        layoutContent.querySelector(".layout-description").style.color = textColor; // Apply text color to description
        const imgElement = layoutContent.querySelector(".layout-image");

        // If an image is uploaded, use it. Otherwise, check if a URL was provided
        if (uploadedImage) {
            imgElement.src = uploadedImage; // Set uploaded image
        } else {
            imgElement.src = "https://via.placeholder.com/150";
        }

        // Handle background image
        if (bgImageUrl) {
            layoutContent.style.backgroundImage = `url(${bgImageUrl})`;
            layoutContent.style.backgroundSize = 'cover';
            layoutContent.style.backgroundPosition = bgPosition;
        }

        // Clear input fields after content is added
        document.getElementById("heading").value = '';
        document.getElementById("paragraph").value = '';
        document.getElementById("imageUrl").value = '';
        document.getElementById("bgImage").value = '';
        imageFileInput.value = ''; // Clear the file input
        uploadedImage = null; // Reset the uploaded image
        uploadedBgImage = null;
    });

    // Handle file upload for images
    imageFileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedImage = event.target.result; // Store the uploaded image as a data URL
            };
            reader.readAsDataURL(file); // Convert file to data URL
        }
    });

    bgImageFileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedBgImage = event.target.result; // Store the uploaded background image as a data URL
            };
            reader.readAsDataURL(file); // Convert file to data URL
        }
    });

    // Capture the content as an image
    captureButton.addEventListener("click", function () {
        if (output.innerHTML === '') {
            alert("Please add content first.");
            return;
        }

        html2canvas(output, { useCORS: true, allowTaint: true }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'project_progress.png';
            link.href = canvas.toDataURL('image/png', 3.0); // Use maximum quality
            link.click();
        });
    });

    // Initialize draggable functionality
    function makeElementsDraggable(container) {
        const draggableElements = container.querySelectorAll(".layout-title, .layout-description, .layout-image");

        draggableElements.forEach(element => {
            let isDragging = false, offsetX, offsetY;

            element.addEventListener("mousedown", function (e) {
                isDragging = true;
                offsetX = e.clientX - element.offsetLeft;
                offsetY = e.clientY - element.offsetTop;

                // Add mousemove and mouseup event listeners to document
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });

            function onMouseMove(e) {
                if (isDragging) {
                    element.style.left = (e.clientX - offsetX) + "px";
                    element.style.top = (e.clientY - offsetY) + "px";
                }
            }

            function onMouseUp() {
                isDragging = false;
                // Remove mousemove and mouseup listeners when done dragging
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
        });
    }
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    element.appendChild(resizeHandle);

    // Make element resizable
    makeElementResizable(element, resizeHandle);

    function makeElementResizable(element, resizeHandle) {
        let isResizing = false;
    
        resizeHandle.addEventListener("mousedown", function (e) {
            isResizing = true;
    
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    
        function onMouseMove(e) {
            if (isResizing) {
                const newWidth = e.clientX - element.getBoundingClientRect().left;
                const newHeight = e.clientY - element.getBoundingClientRect().top;
                if (newWidth > 50) element.style.width = newWidth + "px"; // Minimum width
                if (newHeight > 50) element.style.height = newHeight + "px"; // Minimum height
            }
        }
    
        function onMouseUp() {
            isResizing = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
    }
});
