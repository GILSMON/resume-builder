document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const loading = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const atsScoreSpan = document.getElementById('atsScore');
    const suggestionsList = document.getElementById('suggestionsList');
    const downloadBtn = document.getElementById('downloadBtn');

    let updatedResumeContent = null;

    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fileInput = this.querySelector('input[name="resume"]');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        resultsDiv.style.display = 'none';
        downloadBtn.style.display = 'none';
        loading.style.display = 'block';

        try {
            const response = await fetch('/upload_resume', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                atsScoreSpan.textContent = data.score;
                suggestionsList.innerHTML = '';
                data.suggestions.forEach(s => {
                    const li = document.createElement('li');
                    li.textContent = s;
                    suggestionsList.appendChild(li);
                });

                updatedResumeContent = data.updated_resume_text;
                downloadBtn.style.display = 'block';
                resultsDiv.style.display = 'block';
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred while communicating with the server.');
        } finally {
            loading.style.display = 'none';
        }
    });

    downloadBtn.addEventListener('click', async function() {
        if (!updatedResumeContent) {
            alert('No updated resume content to download.');
            return;
        }

        try {
            const response = await fetch('/download_updated_resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updated_resume_text: updatedResumeContent })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'updated_resume.docx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json();
                alert('Error downloading file: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error during download:', error);
            alert('An error occurred while preparing the download.');
        }
    });
});