//Helper function - format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}
 
//Helper function - format tanggal
function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}
 
//Helper function - truncate text
function truncate(text, length = 80) {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}
 
module.exports = { formatRupiah, formatDate, truncate };