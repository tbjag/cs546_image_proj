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
const imageData = data.images;
const fs = require('fs');
const jimp = require('jimp');
const mongoCollections = require("../data/collections");
const users = mongoCollections.users;
const images = mongoCollections.images;

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
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.kmeans(filepath, k, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
      await usersData.addImageTag(finalImg, dude._id, fileName);			
      let arr = await imageData.getAll();
            res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.greyscale(filepath, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
		        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.invert(filepath, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        const k = req.body.k
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.sepia(filepath, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.remBlue(filepath, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.remRed(filepath, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        console.log(inName)
        console.log(outName)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.remGreen(filepath, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        const k = Number(req.body.k)
        console.log(inName)
        console.log(outName)
        console.log(k)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.blur(filepath, k, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
        const inName = req.body.filename
        const outName = req.body.outputName
        const k = Number(req.body.k)
        console.log(inName)
        console.log(outName)
        console.log(k)
        const profile = await usersData.get(req.session.userId);
        //const rend = "layouts/" + filter
        // actually run the filter here
        // step 1 get the filepath for inName
        // step 2 check uniqueness for outName
        // step 3 run filter
        // step 4 add out image to databases
        console.log("Starting the steps")
        const imgId = await usersData.getIdByName(inName, req.session.userId)
        console.log("Image id is " + imgId)
        const filepath = await imageData.getPath(imgId)
        console.log("filepath is " + filepath)
        const uniqueOut = await usersData.nameUnique(outName, req.session.userId);
        if (uniqueOut)
        {
            const testOut = "public/images/" + req.session.userId + outName + ".jpg"
            await imgFilters.posterize(filepath, k, testOut)
        
			var img = jimp.read(testOut);
			var encode_image = img.toString('base64');
			// Define a JSONobject for the image attributes for saving to database
			var finalImg = {
				contentType: "img/jpg",
				image:  new Buffer.from(encode_image, 'base64'),
				name: outName,
				description: req.body.desc, //MAKE SURE WE PRINT ALT TEXT FOR EVERY IMAGE
				filepath: testOut
			};
			const data = await images();
			const insertInfo = await data.insertOne(finalImg);
  
			//console.log("ID: "+finalImg._id);
			var fileName = outName;
			console.log(req.session.userId);
			const dude = await usersData.get(req.session.userId);
			await usersData.addImageTag(finalImg, dude._id, fileName);			

      let arr = await imageData.getAll();
      res.render("layouts/home", {logged:true, username: profile.firstName, imgarray: arr});
            return;
        }
        else{
            console.log("this isn't good")
          }
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
