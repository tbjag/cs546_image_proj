const usersRoute = require("./users");
const filterRoute = require("./filters");
const homeRoute = require("./home");
const imageRoute = require("./image");

const constructorMethod = app => {
    //first route for when user first accesses site
    app.use("/", homeRoute);
    //auth route: if not auth, redirect to home, if auth then display correct profile and info
    app.use("/profile", usersRoute);
    //redirects to editing page to display proper filters
    app.use("/filters", filterRoute);
    //upload image to mongo using gridfs
    app.use("/image", imageRoute);


    app.use("*", (req, res) => {
        res.redirect("/");
    });
};

module.exports = constructorMethod;