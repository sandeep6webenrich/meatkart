import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define interfaces to ensure type safety
interface InvoiceItem {
  product: {
    name: string;
  } | null;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
}

interface InvoiceOrder {
  orderNumber: string;
  createdAt: string | Date;
  customerInfo: any;
  shippingAddress: any;
  items: InvoiceItem[];
  totalAmount: number | string;
}

export const generateInvoice = (order: InvoiceOrder) => {
  const doc = new jsPDF();

  // Add Company Logo or Name
  doc.setFontSize(22);
  doc.setTextColor(22, 163, 74); // Green color
  doc.text('United Store', 14, 22);
  
  doc.setTextColor(0, 0, 0); // Black color
  doc.setFontSize(14);
  doc.text('Tax Invoice', 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Order Number: ${order.orderNumber}`, 14, 40);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 45);
  doc.text('GSTIN: 29AAAAA0000A1Z5', 14, 50); // Dummy GSTIN

  // Customer Details
  const customer = order.customerInfo;
  doc.setFontSize(11);
  doc.text('Bill To:', 14, 60);
  doc.setFontSize(10);
  doc.text(`${customer?.firstName} ${customer?.lastName}`, 14, 67);
  doc.text(customer?.email || '', 14, 72);
  doc.text(customer?.phone || '', 14, 77);

  // Shipping Details
  const shipping = order.shippingAddress;
  doc.setFontSize(11);
  doc.text('Ship To:', 120, 60);
  doc.setFontSize(10);
  const addressLines = doc.splitTextToSize(
    `${shipping?.street || ''}, ${shipping?.city || ''}, ${shipping?.state || ''} ${shipping?.pincode || ''}`,
    80
  );
  doc.text(addressLines, 120, 67);

  // Table
  const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
  const tableRows: any[] = [];

  order.items.forEach(item => {
    const itemData = [
      item.product?.name || 'Unknown Item',
      item.quantity,
      `Rs. ${Number(item.unitPrice).toFixed(2)}`,
      `Rs. ${Number(item.totalPrice).toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] }, // Green color
    styles: { fontSize: 9 },
  });

  // Calculations
  const subtotal = Number(order.totalAmount);
  const gstRate = 0.18; // 18% GST
  const baseAmount = subtotal / (1 + gstRate);
  const gstAmount = subtotal - baseAmount;
  const finalY = (doc as any).lastAutoTable.finalY || 90;

  // Totals Section
  doc.setFontSize(10);
  doc.text(`Subtotal (excl. GST): Rs. ${baseAmount.toFixed(2)}`, 140, finalY + 10);
  doc.text(`GST (18%): Rs. ${gstAmount.toFixed(2)}`, 140, finalY + 15);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount: Rs. ${subtotal.toFixed(2)}`, 140, finalY + 22);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('This is a computer-generated invoice.', 14, 280);
  doc.text('Thank you for your business!', 14, 285);

  // Save the PDF
  doc.save(`invoice-${order.orderNumber}.pdf`);
};
