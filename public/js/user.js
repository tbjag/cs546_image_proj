// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

function checkRegister(){
  firstN = document.getElementById("firstname").value;
  lastN = document.getElementById("lastname").value;
  age = document.getElementById("age").value;
  if(age<0){
    alert("please enter correct age");
  }
  email = document.getElementById("registeremail").value;
  gender = document.getElementById("registerpassword").value;
  city = document.getElementById("city").value;
  state = document.getElementById("state").value;
  console.log(firstN + lastN);
  alert("HIII");
}

//document.getElementById("register-button").addEventListener();