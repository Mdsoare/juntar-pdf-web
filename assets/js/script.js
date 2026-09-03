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
            // 1. Acessa a biblioteca através do escopo global correto
            const pdfLibObj = window.PDFLib || (typeof PDFLib !== 'undefined' ? PDFLib : null);
            if (!pdfLibObj || !pdfLibObj.PDFDocument) {
                throw new Error('Biblioteca PDFLib não encontrada ou carregada incorretamente.');
            }

            const { PDFDocument } = pdfLibObj;

            // 2. Cria o documento unificado final
            const mergedPdf = await PDFDocument.create();

            for (const file of selectedFiles) {
                // Leitura do arquivo local em ArrayBuffer
                const arrayBuffer = await file.arrayBuffer();

                // Carrega o PDF na memória (ignoreEncryption ignora restrições leves de leitura)
                const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

                // Copia todas as páginas do arquivo atual
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

                // Adiciona as páginas ao documento consolidado
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            // 3. Serializa o PDF final para bytes
            const pdfBytes = await mergedPdf.save();

            // 4. Cria o Blob e aciona o download de forma segura
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);

            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = downloadUrl;
            downloadAnchor.download = `documento_mesclado_${Date.now()}.pdf`;
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();

            // Revogação imediata da URL para evitar Memory Leak
            document.body.removeChild(downloadAnchor);
            URL.revokeObjectURL(downloadUrl);

            showStatus('✔ Fusão concluída com sucesso! Download iniciado.', true, 'status-success');
            selectedFiles = [];
            setTimeout(updateUI, 2000);
        } catch (error) {
            console.error('Detalhes do erro na fusão de PDFs:', error);
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