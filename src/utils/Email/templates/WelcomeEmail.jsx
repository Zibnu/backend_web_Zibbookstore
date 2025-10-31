const React = require("react");

function WelcomeEmail({ username }) {
  return (
    <html>
      <body style={{ fontFamily : "Arial, sans-serif", color : "#333"}}>
        <h2>Hallo {username}</h2>
        <p>Selamat Datang di <b>ZibBookstore</b>! 🎉 </p>
        <p>Terimakasih Telah Mendaftar. Nikmati Pengalaman Berbelanja Buku Bersama Kami 📚.</p>

        <hr />
        <p style={{fontSize : "12px", color : "#777"}}>
          Happy Shooping And Get Your Dream Book✨✨
        </p>
      </body>
    </html>
  )
}

module.exports = WelcomeEmail;