/* 
    DESCRIPTION: filtering route, where we interact with Sams image filters
    when used, display new page that selects options:
    - edit which image, 
    - then which filter,
    - send req,
    - user will wait for it fulfill 
    - have options to share and save with API's
*/

const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const imgFilters = data.filters;

router.post("/kmeans", async function (req,res){
    console.log("kmeansFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.filename
        const outName = req.body.outputName
        const k = Number(req.body.k)
        console.log(inName)
        console.log(outName)
        console.log(k)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        //actually run the filter here
        imgFilters.kmeans(inName, k, outName)

        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/greyscale", async function (req,res){
    console.log("greyscaleFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.greyscale(inName, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/invert", async function (req,res){
    console.log("invertFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.invert(inName, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/sepia", async function (req,res){
    console.log("sepiaFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        const k = req.body.k
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.sepia(inName, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/remBlue", async function (req,res){
    console.log("remBlueFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.remBlue(inName, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/remRed", async function (req,res){
    console.log("remRedFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.remRed(inName, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/remGreen", async function (req,res){
    console.log("remGreenFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.remGreen(inName, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/blur", async function (req,res){
    console.log("blurFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        const k = req.body.k
        console.log(inName)
        console.log(outName)
        console.log(k)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.blur(inName, k, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });

router.post("/posterize", async function (req,res){
    console.log("posterizeFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const inName = req.body.inputName
        const outName = req.body.outputName
        const k = req.body.k
        console.log(inName)
        console.log(outName)
        console.log(k)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        imgFilters.posterize(inName, k, outName)
        res.render("layouts/home", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });



router.post("/filters", async function (req,res){
    console.log("specificFILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const filter = req.body.filt
        console.log(filter)
        const profile = await usersData.get(req.session.userId);
        const rend = "layouts/" + filter
        res.render(rend, {logged:true, username: profile.firstName, imageTag: profile.imageTag});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });



router.get("/", async function (req,res){
    console.log("FILTER");
    if(req.session.userId){
    try{
      if(req.session.userId){
        const profile = await usersData.get(req.session.userId);
        res.render("layouts/filter", {logged:true, username: profile.firstName});
        return;
      }else{
        res.render("layouts/filter", {title: "PSLite Filters", logged:false});
        return;
      }
    }catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  }else{
    res.render("layouts/filter", {logged:false});
  }
  });
  
  module.exports = router;
