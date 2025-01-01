import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "AuthenticationDB",
  password: "514830",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const userPassword = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email]); //check si l'email existe déjà dans la DB

    if(checkResult.rows.length > 0){ //si l'email existe 
      res.send("email already exists, try logging in");
    } else {
      const result = await db.query ('INSERT INTO users(email, password) VALUES ($1,$2)', 
      [email, userPassword]);
      res.render("secrets.ejs");
    }
  } catch (err){
    console.log(err);
  }
  //console.log(email);
  //console.log(userPassword);
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const userPassword = req.body.password;
  
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email]);
  
    if(checkResult.rows.length > 0){ //si l'email existe 
      console.log(checkResult.rows);
      const user = checkResult.rows[0]; //user qu'on a cherché dans la DB
      const realPassword = user.password;
      if(userPassword === realPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("email doesn't exist");
    }
  } catch (err){
    console.log(err);
  }

  //console.log(email);
  //console.log(userPassword);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
