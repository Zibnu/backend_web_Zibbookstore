const React = require("react")

function OrderEmail({full_name, address ,items, total_price}) {
  return (
    <html>
      <body style={{ fontFamily : "Arial, sans-serif", color : "#333"}}>
        <h2>Hallo {full_name}</h2>
        <p>Terimakasih Telah Berbelanja di <b>ZibBookstore</b></p>
        <p>Berikut Detail Pesanan kamu :</p>
        <ul>
          {items.map((item, indeks) => (
            <li key={indeks}>
              {item.title} {/* Rp{Number(item.price_cents).toLocaleString("id-ID")} */}
            </li>
          ))}
        </ul>
        <p>Alamat Penerima {address}</p>
        <p>Total Pembayaran: <b>Rp{Number(total_price).toLocaleString("id-ID")}</b></p>
        <p>Kami Akan Segera Memproses Pesanan Kamu 📦</p>
        <hr />
        <p style={{ fontSize : "12px", color : "#333"}}>
          &copy; {new Date().getFullYear()} Layanan kami. Semua hak dilindungi.
        </p>
      </body>
    </html>
  )
}

module.exports = OrderEmail;