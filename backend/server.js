// Module Loading
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { issueTokens } = require("./issueTokens");

// Application Initialization
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/static")));
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "subsidy_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

// Register Route POST
app.post("/register", async (req, res) => {
  const { firstname, lastname, walletAddress, nida, password, role } = req.body;

  try {
    const [existing] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE wallet_address = ? OR nida = ?",
        [walletAddress, nida],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (existing && existing.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO users 
      (nida, firstname, lastname, wallet_address, totaltokens, role, password)
      VALUES (?, ?, ?, ?, 0, ?, ?)`,
      [nida, firstname, lastname, walletAddress, role, hashedPassword],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error." });
        }
        res.status(201).json({ message: "User registered successfully." });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Login Route POST
app.post("/login", (req, res) => {
  const { nida, password } = req.body;

  if (!nida || !password) {
    return res.status(400).json({ message: "NIDA and password are required" });
  }

  db.query("SELECT * FROM users WHERE nida = ?", [nida], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid NIDA or password" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Password comparison error:", err);
        return res.status(500).json({ message: "Error comparing passwords" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid NIDA or password" });
      }

      res.status(200).json({
        message: "Login successful",
        nida: user.nida,
        userType: user.role,
      });
    });
  });
});

// Get User Data
app.get("/user/:nida", (req, res) => {
  const { nida } = req.params;
  db.query(
    `SELECT firstname, lastname, wallet_address, totaltokens FROM users WHERE nida = ?`,
    [nida],
    (err, results) => {
      if (err) return res.status(500).json({ message: `Database error` });
      if (results.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = results[0];
      res.json({
        name: `${user.firstname} ${user.lastname}`,
        address: user.address,
        walletAddress: user.wallet_address,
        totalTokens: user.totaltokens,
      });
    }
  );
});

// Admin Get All Users
app.get("/admin/users", (req, res) => {
  const query = `
    SELECT 
      nida, 
      CONCAT(firstname, ' ', lastname) AS name, 
      wallet_address AS walletAddress,
      totaltokens, 
      role 
    FROM users
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ users: results });
  });
});

// Issue Tokens to User
app.post("/admin/issue-tokens", async (req, res) => {
  const { walletAddress, nida, amount } = req.body;
  const numericAmount = Number(amount);

  try {
    const tx = await issueTokens(walletAddress, amount);

    db.query(
      `UPDATE users SET totaltokens = totaltokens + ? WHERE wallet_address = ? AND nida = ?`,
      [numericAmount, walletAddress, nida],
      (err, result) => {
        if (err) {
          console.error("Database update error:", err);
          return res.status(500).json({ message: "Database update failed." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found." });
        }else{
            console.log("Updated tokens in the database.");
        }

        return res.status(200).json({
          message: `Issued ${numericAmount} tokens successfully.`,
        });
      }
    );
  } catch (error) {
    console.error("Blockchain error:", error);
    res.status(500).json({ message: "Token issuance failed." });
  }
});

// Server register.html
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/static/register.html"));
});

// Server login.html
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/static/login.html"));
});

// Server index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/static/index.html"));
});

// Initialize Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
