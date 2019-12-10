const usersRoute = require("./users");
const dataRoute = require("./data");
const filterRoute = require("./filters");
const homeRoute = require("./home")

const constructorMethod = app => {
    //proj routes
    //first route for when user first accesses site
    app.use("/", homeRoute);
    //auth route: if not auth, redirect to home, if auth then display correct profile and info
    //app.use("/users", usersRoute);
    //stores images, handles image requests from authorized users
    //app.use("/data", dataRoute);
    //redirects to editing page to display proper filters
    //app.use("/filter", filterRoute);

    app.use("*", (req, res) => {
        res.redirect("/");
    });
};

module.exports = constructorMethod;