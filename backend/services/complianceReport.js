const PDFDocument = require('pdfkit');

/**
 * Generates a DIN 91434 Compliance Report.
 * @param {Object} data 
 * @returns {Promise<Buffer>}
 */
async function generateComplianceReport(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(20).text('SCARAB Protocol AgriSentinel', { align: 'center' });
      doc.fontSize(16).text('Compliance Report (DIN SPEC 91434)', { align: 'center' });
      doc.moveDown();

      // Device metadata
      doc.fontSize(12).text(`Device ID Hash: ${data.deviceId || 'UNKNOWN'}`);
      doc.text(`H3 Cell: ${data.h3Cell || 'UNKNOWN'}`);
      doc.text(`Installation Date: ${data.installationDate || 'UNKNOWN'}`);
      doc.text(`Tier: ${data.tier || 'UNKNOWN'}`);
      doc.moveDown();

      // 90-day data summary
      doc.fontSize(14).text('90-Day Data Summary', { underline: true });
      doc.fontSize(12).text(`Average Leaf Area Index (LAI): ${data.laiAvg || 'N/A'}`);
      doc.text(`Average Soil Health Score: ${data.soilHealthAvg || 'N/A'}/5`);
      doc.text(`Average Microclimate Protection: +${data.microclimateAvg || '0'}°C`);
      doc.moveDown();

      // ATECC608A signature block
      doc.fontSize(14).text('Cryptographic Attestation', { underline: true });
      doc.fontSize(10).font('Courier').text(`Signature: ${data.signature || 'N/A'}`);
      doc.font('Helvetica');
      doc.moveDown();

      // Disclaimer
      doc.fontSize(10).fillColor('gray')
         .text('Disclaimer: This report is generated from hardware-attested sensor data. It is an informational tool and does not constitute a legal declaration of compliance with DIN SPEC 91434. Formal compliance assessment requires evaluation by a qualified agronomist.', {
           align: 'justify'
         });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  generateComplianceReport
};
