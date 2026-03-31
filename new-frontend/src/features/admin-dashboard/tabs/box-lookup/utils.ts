import { BoxView } from "@/types/box";

export const printBoxLabels = (selectedBoxes: BoxView[]): void => {
  if (selectedBoxes.length === 0) return;

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print labels");
    return;
  }

  // Start building the HTML content for printing
  printWindow.document.write(`
    <html>
      <head>
        <title>Box Labels</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 0; 
            padding: 0;
          }
          .box-label { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 16px; 
            max-width: 480px; 
            margin: 20px auto;
            background-color: white; 
            page-break-after: always;
          }
          .box-header { 
            display: flex; 
            justify-content: space-between; 
            border-bottom: 1px solid #f3f4f6; 
            padding-bottom: 12px; 
            margin-bottom: 12px; 
          }
          .box-name { 
            font-size: 20px; 
            font-weight: 600; 
            color: #111827;
          }
          .location { 
            display: flex;
            align-items: center;
            color: #4b5563; 
            font-size: 14px;
          }
          .location-icon {
            margin-right: 4px;
            color: #6b7280;
          }
          .timestamp { 
            font-size: 12px; 
            color: #6b7280; 
            margin: 8px 0 16px;
            display: flex;
            gap: 12px;
          }
          .timestamp-item {
            display: flex;
            align-items: center;
          }
          .timestamp-icon {
            margin-right: 4px;
          }
          .contents {
            margin-top: 16px;
          }
          .contents-header {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #111827;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 14px;
          }
          th { 
            padding: 8px; 
            text-align: left; 
            color: #6b7280;
            font-weight: 500;
            border-bottom: 1px solid #e5e7eb; 
          }
          td { 
            padding: 8px; 
            text-align: left; 
            border-bottom: 1px solid #f3f4f6; 
          }
          .barcode-container { 
            text-align: center; 
            margin-top: 24px; 
            padding-top: 16px; 
            border-top: 1px solid #f3f4f6; 
          }
          .barcode-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: -3px;
          }
          .box-label:last-child {
            page-break-after: avoid;
          }
          @media print {
            @page {
              margin: 0;
              size: auto;
            }
            body { 
              margin: 0; 
              padding: 0; 
            }
            .box-label { 
              box-shadow: none; 
              border: 1px solid #e5e7eb;
              margin: 0 auto;
              width: 100%;
              max-width: 480px;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
  `);

  // For each selected box, create a label
  selectedBoxes.forEach((box, index) => {
    printWindow.document.write(`
      <div class="box-label">
        <div class="box-header">
          <div class="box-name">${box.name}</div>
          <div class="location">
            <span class="location-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            ${box.location || "No location"}
          </div>
        </div>
        <div class="timestamp">
          <div class="timestamp-item">
            <span class="timestamp-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            Created: ${new Date(box.createdAt || Date.now()).toLocaleDateString()
      }
          </div>
          ${box.updatedAt
        ? `
          <div class="timestamp-item">
            <span class="timestamp-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            Updated: ${new Date(box.updatedAt).toLocaleDateString()}
          </div>`
        : ""
      }
        </div>
        <div class="contents">
          <div class="contents-header">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Contents
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Gender</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
    `);

    // Add contents table rows
    if (box.contents && box.contents.length > 0) {
      box.contents.forEach((item) => {
        printWindow.document.write(`
          <tr>
            <td>${item.type}</td>
            <td>${item.size}</td>
            <td>${item.gender}</td>
            <td>${item.quantity}</td>
          </tr>
        `);
      });
    } else {
      printWindow.document.write(`
        <tr>
          <td colspan="4" style="text-align: center;">No items</td>
        </tr>
      `);
    }

    printWindow.document.write(`
            </tbody>
          </table>
        </div>
        <!-- <div class="barcode-container">
          <div class="barcode-label">Box ID: ${box.id}</div>
          <svg id="barcode-${index}"></svg>
        </div> -->
      </div>
    `);
  });

  printWindow.document.write(`
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      <script>
        window.onload = function() {
  `);

  // Add JS to generate barcodes for each box
  selectedBoxes.forEach((box, index) => {
    const createdTimestamp = box.createdAt
      ? new Date(box.createdAt).getTime()
      : Date.now();

    printWindow.document.write(`
      try {
        JsBarcode("#barcode-${index}", "${createdTimestamp}", {
          format: "ITF",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 12,
          margin: 10,
          textMargin: 5
        });
      } catch (e) {
        try {
          console.warn("Could not use ITF format for timestamp ${createdTimestamp}, falling back to CODE128");
          JsBarcode("#barcode-${index}", "${createdTimestamp}", {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: true,
            fontSize: 12,
            margin: 10
          });
        } catch (e2) {
          console.error("Error generating barcode for timestamp ${createdTimestamp}:", e2);
        }
      }
    `);
  });

  printWindow.document.write(`
          setTimeout(function() {
            window.print();
          }, 1200);
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
};
