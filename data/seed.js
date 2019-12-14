const mongoCollections = require('./collections');
const users = mongoCollections.users;
//const images = mongoCollections.images;
//const comments = mongoCollections.comments;
//^add to seed script later
async function runSetup() {
    const userCollection = await users;
    try {
      // We can recover from this; if it can't drop the collection, it's because
      await userCollection.drop();
    } catch (e) {
      // the collection does not exist yet!
    }

//make users functions
const makeUser = function(firstName, lastName, email, gender, state, city, age, hP) {
    return {
      firstName: firstName,
      lastName: lastName,
      email: email,
      gender: gender,
      state: state,
      city: city,
      age: age,
      hashedPassword: hP
    };
};

//making 4 different users -- sam, theo, kurt, alex
const alexK = makeUser("Alex", 
"Kubecka", 
"akubecka@stevens.edu", 
"M", 
"New York", 
"Syracuse", 
20, 
"$2a$06$W3oebvGfBscq592AXU53t.HaDWrcUmod/Mg.Gn1S6M08hRwuZwVQS");//using bcrypt -- 6 rounds salt pass: alex

const kurtV = makeUser("Kurt", 
"Von AutenRied", 
"kvonaute@stevens.edu", 
"M", 
"New Jersey", 
"Princeton", 
21, 
"$$2a$06$9wpGbo8wg6bbHguHjc27FevTFq0.CDWWF7tYnZGbkahly5LJeFdXm");//using bcrypt -- 6 rounds salt pass: kurt

const samK = makeUser("Samuel", 
"Kraus", 
"skraus@stevens.edu", 
"M", 
"New Jersey", 
"Princeton", 
21, 
"$2a$06$E3Ih5uZtvfCsxu/2kybG4OsaApjEmMTqyiIc9GQJYhKyZDmha5CI.");//using bcrypt -- 6 rounds salt pass: sam

const theoJ = makeUser("Theodore", 
"Jagodits", 
"tjagodit@stevens.edu", 
"M", 
"Maryland", 
"Poolesville", 
21, 
"$2a$06$R9/z923tjP.cc7OxZ7iKTOpzRLfy28ABYSpWkrZuWdHUqTVMNAtxK");//using bcrypt -- 6 rounds salt pass: theo

await userCollection.insertMany([theoJ, samK, kurtV, alexK]);

return await userCollection.find().toArray();

}

//TODO
//add comments to images and images themselves


exports = module.exports = {runSetup};


