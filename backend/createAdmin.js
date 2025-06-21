const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "subsidy_db",
});

const admin = {
  nida: "123000",
  firstname: "Admin",
  lastname: "Admin",
  password: "admin",
  wallet_address: process.env.DEPLOYERADDRESS,
  totaltokens: 0,
  role: "admin",
};

async function createAdmin() {
  try {
    db.connect();

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const sql = `
      INSERT INTO users (nida, firstname, lastname, password, wallet_address, totaltokens, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      admin.nida,
      admin.firstname,
      admin.lastname,
      hashedPassword,
      admin.wallet_address,
      admin.totaltokens,
      admin.role,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log("Admin already exists.");
        } else {
          console.error("Failed to insert admin:", err);
        }
      } else {
        console.log("Admin user inserted successfully.");
      }
      db.end();
    });
  } catch (err) {
    console.error("Error:", err);
    db.end();
  }
}

createAdmin();
