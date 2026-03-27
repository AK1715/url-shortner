const express = require('express');
const path = require('path');
const { connectToMongoDB } = require('./conntect');
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");

const URL = require('./models/url'); 

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb+srv://url_shotner_node:url_shotner_node@cluster0.vjbh4pd.mongodb.net/?appName=Cluster0').then(console.log("mongoDB connected"));

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls
    });
});

app.use('/url', urlRoute);
app.use('/', staticRouter);

app.use('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now(),
        }
    } });
    res.redirect(entry.redirectURl);
})

app.listen(PORT, () => console.log(`Server Started at PORT:- ${PORT}`));
