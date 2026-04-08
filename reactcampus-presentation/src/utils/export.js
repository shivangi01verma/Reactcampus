import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

export const exportToPDF = async (slides, currentSlide, setCurrentSlide) => {
  const overlay = showLoadingOverlay();
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [960, 540],
    compress: true
  });

  try {
    for (let i = 0; i < slides.length; i++) {
      updateProgress(overlay, i + 1, slides.length);
      
      // Navigate to slide
      setCurrentSlide(i);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const slideElement = document.querySelector('.slide');
      if (!slideElement) continue;

      // Capture with optimized settings
      const canvas = await html2canvas(slideElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Convert to JPEG with compression
      const imgData = canvas.toDataURL('image/jpeg', 0.85);

      // Calculate centering
      const pdfWidth = 960, pdfHeight = 540;
      const imgAspect = canvas.width / canvas.height;
      const pdfAspect = pdfWidth / pdfHeight;

      let finalWidth, finalHeight, xOffset, yOffset;
      if (imgAspect > pdfAspect) {
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / imgAspect;
        xOffset = 0;
        yOffset = (pdfHeight - finalHeight) / 2;
      } else {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * imgAspect;
        xOffset = (pdfWidth - finalWidth) / 2;
        yOffset = 0;
      }

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
    }

    pdf.save('ReactCampus-Data-Analysis.pdf');
  } finally {
    hideLoadingOverlay(overlay);
    setCurrentSlide(currentSlide);
  }
};

export const exportToPPTX = async (slides, currentSlide, setCurrentSlide) => {
  const overlay = showLoadingOverlay();
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  try {
    for (let i = 0; i < slides.length; i++) {
      updateProgress(overlay, i + 1, slides.length);
      
      // Navigate to slide
      setCurrentSlide(i);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const slideElement = document.querySelector('.slide');
      if (!slideElement) continue;

      // Capture with optimized settings
      const canvas = await html2canvas(slideElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');

      // Calculate centering
      const slideWidth = 10, slideHeight = 5.625;
      const imgAspect = canvas.width / canvas.height;
      const slideAspect = slideWidth / slideHeight;

      let finalWidth, finalHeight, xOffset, yOffset;
      if (imgAspect > slideAspect) {
        finalWidth = slideWidth;
        finalHeight = slideWidth / imgAspect;
        xOffset = 0;
        yOffset = (slideHeight - finalHeight) / 2;
      } else {
        finalHeight = slideHeight;
        finalWidth = slideHeight * imgAspect;
        xOffset = (slideWidth - finalWidth) / 2;
        yOffset = 0;
      }

      const slide = pptx.addSlide();
      slide.addImage({
        data: imgData,
        x: xOffset,
        y: yOffset,
        w: finalWidth,
        h: finalHeight
      });
    }

    await pptx.writeFile({ fileName: 'ReactCampus-Data-Analysis.pptx' });
  } finally {
    hideLoadingOverlay(overlay);
    setCurrentSlide(currentSlide);
  }
};

function showLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'export-overlay';
  overlay.innerHTML = `
    <div class="export-content">
      <div class="export-spinner"></div>
      <h2>Exporting Presentation...</h2>
      <p class="export-progress">Preparing...</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function updateProgress(overlay, current, total) {
  const progress = (current / total) * 100;
  overlay.querySelector('.export-progress').textContent = `Slide ${current} of ${total}`;
  overlay.querySelector('.progress-fill').style.width = `${progress}%`;
}

function hideLoadingOverlay(overlay) {
  overlay.remove();
}

// Made with Bob
