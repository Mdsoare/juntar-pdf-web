/**
 * Application: Juntar PDF (Client-Side)
 * DevSecOps Focus: Strict CSP, Safe DOM Manipulation & Zero External Data Leakage.
 */

'use strict';

if (self !== top) {
    top.location = self.location;
}

document.addEventListener('DOMContentLoaded', () => {

    let selectedFiles = [];

    const pdfInput = document.getElementById('pdfInput');
    const dropzone = document.getElementById('dropzone');
    const fileListSection = document.getElementById('fileListSection');
    const fileList = document.getElementById('fileList');
    const mergeBtn = document.getElementById('mergeBtn');
    const addMoreBtn = document.getElementById('addMoreBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statusBox = document.getElementById('statusBox');

    function showStatus(msg, isVisible, className = '') {
        statusBox.className = `status-message ${className}`;
        statusBox.textContent = msg;
        if (isVisible || msg) {
            statusBox.classList.add('visible');
        } else {
            statusBox.classList.remove('visible');
        }
    }

    function updateUI() {
        while (fileList.firstChild) {
            fileList.removeChild(fileList.firstChild);
        }

        if (selectedFiles.length > 0) {
            fileListSection.classList.add('visible');
            clearBtn.disabled = false;
            mergeBtn.disabled = selectedFiles.length < 2;

            selectedFiles.forEach((file, index) => {
                const li = document.createElement('li');
                li.className = 'file-item';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'file-name';
                nameSpan.textContent = `${index + 1}. ${file.name}`;

                const sizeSpan = document.createElement('span');
                sizeSpan.className = 'file-size';
                sizeSpan.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

                li.appendChild(nameSpan);
                li.appendChild(sizeSpan);
                fileList.appendChild(li);
            });
        } else {
            fileListSection.classList.remove('visible');
            clearBtn.disabled = true;
            mergeBtn.disabled = true;
        }
    }

    function handleFileSelection(files) {
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            if (file.type === 'application/pdf' && file.name.toLowerCase().endsWith('.pdf')) {
                selectedFiles.push(file);
            }
        });

        pdfInput.value = '';
        updateUI();
    }

    function clearQueue() {
        selectedFiles = [];
        showStatus('', false);
        updateUI();
    }

    // Handlers
    dropzone.addEventListener('click', () => pdfInput.click());
    addMoreBtn.addEventListener('click', () => pdfInput.click());

    dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pdfInput.click();
        }
    });

    dropzone.addEventListener('dragover', (e) => e.preventDefault());

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files) {
            handleFileSelection(e.dataTransfer.files);
        }
    });

    pdfInput.addEventListener('change', (e) => {
        if (e.target.files) {
            handleFileSelection(e.target.files);
        }
    });

    clearBtn.addEventListener('click', clearQueue);

    async function mergeAllPDFs() {
        if (selectedFiles.length < 2) return;

        showStatus('Processando e renderizando documentos PDF...', false, 'status-success');
        mergeBtn.disabled = true;
        clearBtn.disabled = true;

        try {
            if (typeof window.PDFLib === 'undefined') {
                throw new Error('Biblioteca PDFLib não carregada.');
            }

            const mergedPdf = await window.PDFLib.PDFDocument.create();

            for (const file of selectedFiles) {
                const fileBytes = await file.arrayBuffer();
                const pdfDoc = await window.PDFLib.PDFDocument.load(fileBytes, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = blobUrl;
            downloadAnchor.download = `documento_mesclado_${Date.now()}.pdf`;
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();

            document.body.removeChild(downloadAnchor);
            URL.revokeObjectURL(blobUrl);

            showStatus('✔ Fusão concluída com sucesso! Download iniciado.', true, 'status-success');
            selectedFiles = [];
            setTimeout(updateUI, 2000);
        } catch {
            showStatus(
                '❌ Erro crítico ao fundir PDFs. Certifique-se de que nenhum arquivo possui proteção por senha.',
                true,
                'status-error'
            );
        } finally {
            mergeBtn.disabled = false;
            clearBtn.disabled = false;
        }
    }

    mergeBtn.addEventListener('click', mergeAllPDFs);
});