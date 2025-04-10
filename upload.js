document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const previewImage = document.getElementById('previewImage');
    const removeFile = document.getElementById('removeFile');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const uploadError = document.getElementById('uploadError');
    const errorMessage = document.getElementById('errorMessage');

    if (!dropzone || !fileInput) return;

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.backgroundColor = 'var(--primary-lightest)';
    }

    function unhighlight() {
        dropzone.style.borderColor = 'var(--gray-300)';
        dropzone.style.backgroundColor = 'transparent';
    }

    // Handle file drop
    dropzone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files[0]);
        }
    }

    // Handle file selection via button
    dropzone.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(this.files[0]);
        }
    });

    // Process the selected file
    function handleFiles(file) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'application/dicom'];
        if (!validTypes.includes(file.type)) {
            showError('Invalid file type. Please upload a JPEG, PNG, or DICOM file.');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError('File is too large. Maximum size is 10MB.');
            return;
        }

        // Hide error if previously shown
        uploadError.classList.add('hidden');
        
        // Show file preview
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Create image preview if it's an image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            // For DICOM files, show a placeholder
            previewImage.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: var(--gray-100);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </div>
            `;
        }
        
        // Show file preview and hide dropzone
        dropzone.classList.add('hidden');
        filePreview.classList.remove('hidden');
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    }

    // Remove file
    if (removeFile) {
        removeFile.addEventListener('click', function() {
            fileInput.value = '';
            filePreview.classList.add('hidden');
            dropzone.classList.remove('hidden');
            uploadProgress.classList.add('hidden');
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
        });
    }

    // Analyze button
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            // Show progress
            uploadProgress.classList.remove('hidden');
            analyzeBtn.disabled = true;
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(function() {
                progress += 5;
                progressFill.style.width = progress + '%';
                progressPercent.textContent = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    // Redirect to results page after a short delay
                    setTimeout(function() {
                        window.location.href = 'results.html';
                    }, 500);
                }
            }, 100);
        });
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        uploadError.classList.remove('hidden');
    }
});