import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
const port = 3000;
app.set('viewengine','ejs');

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"bookLibrary",
    password:'9900',
    port:5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
let book;
app.get("/",async(req,res)=>{
    const result = await db.query("SELECT * FROM BOOK");
     book = result.rows;
     res.render("index.ejs",{books:book});
     console.log(book);
    
});
app.post("/photo",async(req,res)=>{
    const isbn = req.body.cover;
    const response = await axios.get(` https://covers.openlibrary.org/b/isbn/${isbn}-M.json`);
    res.send(response.data);
});
app.post("/notes",async(req,res)=>{

    const id = req.body.bookid;
    console.log("Received bookid:", id);
    const result = await db.query("SELECT notes from book where id = $1;",[id]);
    const notes =result.rows;
    res.render("notes.ejs",{notes:notes});
});










app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
})