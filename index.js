async function loadScript(url) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script load error for ${url}`));
    document.head.appendChild(script);
  });
}

async function generatePDF() {
  // Load the jsPDF script
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"
  );

  // Now jsPDF should be available
  const { jsPDF } = window.jspdf; // Access jsPDF from the global window object

  let pdf = new jsPDF();
  let elements = document.getElementsByTagName("img");

  for (let i = 0; i < elements.length; i++) {
    let img = elements[i];
    if (!/^blob:/.test(img.src)) {
      continue; // Skip images that are not blobs
    }

    let can = document.createElement("canvas");
    let con = can.getContext("2d");

    can.width = img.width;
    can.height = img.height;

    con.drawImage(img, 0, 0, img.width, img.height);
    let imgData = can.toDataURL("image/jpeg", 1.0);

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      pdf.internal.pageSize.width,
      pdf.internal.pageSize.height
    );

    if (i < elements.length - 1) {
      pdf.addPage(); // Add new page for the next image
    }
  }

  pdf.save(document.title.split(".pdf - ")[0] + ".pdf");
}

// Call the function to generate the PDF
generatePDF();
