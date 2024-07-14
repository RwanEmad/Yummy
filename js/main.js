///<reference types="../@types/jquery"/>







// $(document).ready(() => {
  
//         $(".loading-screen").fadeOut(1300)
//         $("body").css("overflow","visible")
   
// })

$(".loading-screen").fadeOut(1300)
navWidth= $('.nav-tab').outerWidth()
$('.side-nav').animate({left:-navWidth},1300)

var sideNavOpened=false

navWidth= $('.nav-tab').outerWidth()
$('.side-nav').css('left',-navWidth)

$('#navSideBtn').on('click',function(){
    if(sideNavOpened==false){
       openSideNav()
      
    }else{
       
        closeSideNav()
    }
})

$(document).on('click',function(e){
    if(sideNavOpened==true){

        closeSideNav()
    }
})
$('.side-nav').on('click', function (e) {
    e.stopPropagation()
})


getRandomMeals();


function closeSideNav(){
    navWidth= $('.nav-tab').outerWidth()
    $('.side-nav').animate({left:-navWidth},500,function(){
        if(sideNavOpened==true){
            sideNavOpened=false;
            $('#navSideBtn').removeClass("fa-x")
            $('#navSideBtn').addClass("fa-bars")
        }
    })

    $(".nav-links li").animate({
        top: 300
    }, 500)


}
function openSideNav(){
    $('.side-nav').animate({left:"0"},500,function(){
        if(!sideNavOpened){
            sideNavOpened=true;
            $('#navSideBtn').removeClass("fa-bars")
            $('#navSideBtn').addClass("fa-x")
        }
    })

    for (let i = 0; i < 5; i++) {
        $(".nav-links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}



async function getRandomMeals() {

    const mealPromises = [];
    for (let i = 0; i < 20; i++) {
        api=fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        if (mealPromises[i-1]!= api) {
             mealPromises.push(api
            .then(response => response.json())
            .then(data => data.meals[0])); 
        }else{
            api=fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        }
       
    }

    try {
        const meals = await Promise.all(mealPromises);
        displayMeals(meals,"#content")
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
}
// Fetch and display 20 random meals

function displayMeals(meals,location) {
    
    $('#content').removeClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')
   var box = ""
for (var i = 0; i <meals.length; i++) {
    box += ` 
     <div class="col-md-3 p-3 ">
                        <div onclick="getMealDetails(${meals[i].idMeal})" class="content  rounded-3 position-relative">
                           <!-- <img src="images/g046bb1663960946.jpg" class="w-100 rounded-3" alt="">
                           -->  
                           <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                             <div class="overlay h-100 w-100 rounded-3 d-flex align-items-center ps-2">
                                <h3 class="">${meals[i].strMeal}</h3>
                             </div>
                        </div>
                       
                    </div>
    
    `
}
$(location).html(box) 
}

////////// MEAL DETAILS //////////////////

async function getMealDetails(mealId){
        try {
            $("#detailsLoading").fadeIn(300)
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+mealId);
            const contentType = response.headers.get("content-type");
    
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
    
                if (data && data.meals && data.meals.length > 0) {
                    const meal = data.meals[0];
                    // Access idMeal safely
                    displayMealDetails(meal)
                    $("#detailsLoading").fadeOut(300)
                } else {
                    console.error("No meals found in the response");
                }
            } else {
                console.log("Received non-JSON response");
                const text = await response.text();
                console.log(text);  // Log the HTML error message
            }
        } catch (error) {
            console.error('Error:', error);
        }
} 
function displayMealDetails(meal){
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').removeClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')

    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")

    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    box=`
        <div class="container">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="p-3">
                                        <img src="${meal.strMealThumb}" class="w-100 rounded-3 " alt="">
                                        <h2 class=" pt-3">${meal.strMeal}</h2>
                                    </div>
                                
                                </div>
                                <div class="col-md-8">
                                <div class="py-3 pe-3">
                                    <h2 class="">Instructions</h2>
                                    <p class="text-white">${meal.strInstructions}</p>
                                    <h3 class="text-white my-3"><span>Area : </span>${meal.strArea}</h3>
                                    <h3 class="text-white my-3"><span>Category : </span>${meal.strCategory}</h3>
                                    <h3 class="text-white "><span>Recipes :</span></h3>
                                    <ul id="Recipes" class="list-unstyled d-flex g-3 flex-wrap">
                                    ${ingredients}
                                    </ul>
                                    <h3 class="text-white"><span>Tags :</span></h3>
                                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                                            ${tagsStr}

                                            </ul>
                                                <a target="_blank" href="null" class="btn btn-success">Source</a>
                                                <a target="_blank" href="https://www.youtube.com/watch?v=1IszT_guI08" class="btn btn-danger">Youtube</a>
                                </div>
                                </div>
                            </div>
                        </div>

        
     `
    $('#detailsContent').html(box)
}


////////// MEAL CATEGORIES//////////////////
async function getCategories() {
   
    try {
         $("#categoriesLoading").fadeIn(300)
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const contentType = response.headers.get("content-type");
       
        if (contentType && contentType.indexOf("application/json") !== -1) {

            const data = await response.json();
            console.log(data.categories);
           displayCategories(data.categories)
           $("#categoriesLoading").fadeOut(300)
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayCategories(cats){
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').removeClass('d-none')
    $('#Areas').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')


    var box = ""
    for (var i = 0; i <cats.length; i++) {
        box+= ` 
             <div class="col-md-3 p-3 ">
                <div onclick="getCatMeals('${cats[i].strCategory}')" class="content  rounded-3 position-relative">
                    <img src="${cats[i].strCategoryThumb}" class="w-100 rounded-3" alt="">
                    <div class="overlay h-100 w-100 rounded-3 d-flex flex-column justify-content-center align-items-center px-2 text-center">
                        <h3 class="">${cats[i].strCategory}</h3>
                        <p>${cats[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                     </div>
                </div>
                               
             </div>
        `
    }
    $("#CatContent").html(box) 

}



///////////CATEGORY MEALS//////////////////
async function getCatMeals(category) {
    try {
        $("#catMealsLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
             // Access idMeal safely
                displaCatMeals(meal)
                $("#catMealsLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displaCatMeals(meals){
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').removeClass('d-none')
    $('#Areas').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')

    var box = ""
    for (var i = 0; i <meals.length; i++) {
        box += ` 
             <div class="col-md-3 p-3 ">
                        <div onclick="getMealDetails(${meals[i].idMeal})" class="content  rounded-3 position-relative">
                           <!-- <img src="images/g046bb1663960946.jpg" class="w-100 rounded-3" alt="">
                           -->  
                           <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                             <div class="overlay h-100 w-100 rounded-3 d-flex align-items-center ps-2">
                                <h3 class="">${meals[i].strMeal}</h3>
                             </div>
                        </div>
                       
                    </div>
        `
    }
    $("#CatMealsContent").html(box) 

}



///////////Area//////////////////
async function getMealsArea() {
    try {
        $("#areasLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
                console.log(meal);
             // Access idMeal safely
             displayAreas(meal)
             $("#areasLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayAreas(areas){
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').removeClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')


    var box = ""
    for (var i = 0; i <areas.length; i++) {
        box+= ` 
            <div class="col-md-3 p-3 ">
                <div onclick="getMealsOfArea('${areas[i].strArea}')" class="content  rounded-3 position-relative d-flex flex-column justify-content-center align-items-center">
                    <i class="fa-solid fa-house-laptop fa-4x text-white"></i>
                    <h3 class="text-white mt-3">${areas[i].strArea}</h3>
                </div>
                               
            </div> 
        `
    }
    $("#AreasContent").html(box) 

}

///////////Meals of Area//////////////////
async function getMealsOfArea(area) {
    try {
        $("#AreaMealsLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
                console.log(meal);
             // Access idMeal safely
             displayAreaMeals(meal)
             $("#AreaMealsLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayAreaMeals(meals) {
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').removeClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')


    var box = ""
    for (var i = 0; i <meals.length; i++) {
        box += ` 
             <div class="col-md-3 p-3 ">
                        <div onclick="getMealDetails(${meals[i].idMeal})" class="content  rounded-3 position-relative">
                           <!-- <img src="images/g046bb1663960946.jpg" class="w-100 rounded-3" alt="">
                           -->  
                           <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                             <div class="overlay h-100 w-100 rounded-3 d-flex align-items-center ps-2">
                                <h3 class="text-black">${meals[i].strMeal}</h3>
                             </div>
                        </div>
                       
                    </div>
        `
    }
    $("#AreaMealsContent").html(box) 

}



///////////Ingredients///////////////

async function getIngredients() {
    try {
        $("#IngredientsLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
                // console.log(meal);
             // Access idMeal safely
             displayIngredients(meal)
             $("#IngredientsLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayIngredients(ingredients) {
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').addClass('d-none')
    $('#Ingredients').removeClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')
    var box = ""
    for (var i = 0; i <20; i++) {
        box += ` 
            <div class="col-md-3 p-3 ">
                <div onclick="getIngredMeals('${ingredients[i].strIngredient}')" class="content  rounded-3 position-relative d-flex flex-column justify-content-center align-items-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
                    <h3 class="text-white mt-3">${ingredients[i].strIngredient}</h3>
                    <p class="text-center">${ingredients[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>    
        `
    }
    $("#IngredientsContent").html(box) 

}


///////////Ingrediant Meals//////////////////
async function getIngredMeals(ingrediant) {
    try {
        $("#IngredientMealsLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
             // Access idMeal safely
             displayIngredMeals(meal)
             $("#IngredientMealsLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function displayIngredMeals(meals) {
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').removeClass('d-none') 
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').addClass('d-none')
    var box = ""
    for (var i = 0; i <meals.length; i++) {
        box += ` 
             <div class="col-md-3 p-3 ">
                        <div onclick="getMealDetails(${meals[i].idMeal})" class="content  rounded-3 position-relative">
                           <!-- <img src="images/g046bb1663960946.jpg" class="w-100 rounded-3" alt="">
                           -->  
                           <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                             <div class="overlay h-100 w-100 rounded-3 d-flex align-items-center ps-2">
                                <h3 class="text-black">${meals[i].strMeal}</h3>
                             </div>
                        </div>
                       
                    </div>
        `
    }
    $("#IngredientMealsContent").html(box) 
}


///////////Search By Name////////////////

function showSearchInputs() {
    $("#SearchLoading").fadeIn(300)

    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').removeClass('d-none')
    $('#contact').addClass('d-none')
    $("#SearchLoading").fadeOut(300)


}

async function searchByName(name) {
    try {
        $("#searchResultsLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
             for (let i = 0; i < meal.length; i++) {
                console.log(meal[i]);
             }
             displayResults(meal)
             $("#searchResultsLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function searchByFLetter(letter) {

    // $(".inner-loading-screen").fadeIn(300)

    try {
        $("#searchResultsLoading").fadeIn(300)

        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data && data.meals && data.meals.length > 0) {
                const meal = data.meals;
             // Access idMeal safely
             displayResults(meal)
             $("#searchResultsLoading").fadeOut(300)

            } else {
                console.error("No meals found in the response");
            }
        } else {
            console.log("Received non-JSON response");
            const text = await response.text();
            console.log(text);  // Log the HTML error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
    // $(".inner-loading-screen").fadeOut(300)

}

function displayResults(meals){
    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#SearchResult').removeClass('d-none')
   var box=''
    console.log(meals);
            for (var i = 0; i <meals.length; i++) {
                box += ` 
                    <div class="col-md-3 p-3 ">
                                <div onclick="getMealDetails(${meals[i].idMeal})" class="content  rounded-3 position-relative">
                                <!-- <img src="images/g046bb1663960946.jpg" class="w-100 rounded-3" alt="">
                                -->  
                                <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                                    <div class="overlay h-100 w-100 rounded-3 d-flex align-items-center ps-2">
                                        <h3 class="text-black">${meals[i].strMeal}</h3>
                                    </div>
                                </div>
                            
                            </div>
                `
            }
        $('#resultsContent').html(box)

}

//////////Contact Us/////////////////
function showContactUs(){
    $("#contactLoading").fadeIn(300)

    if(sideNavOpened==true){
        closeSideNav()
    }
    $('#content').addClass("d-none")
    $('#Details').addClass("d-none")
    $('#categories').addClass('d-none')
    $('#catMeals').addClass('d-none')
    $('#Areas').addClass('d-none')
    $('#AreaMeals').addClass('d-none')
    $('#Ingredients').addClass('d-none')
    $('#IngredientMeals').addClass('d-none')
    $('#Search').addClass('d-none')
    $('#SearchResult').addClass('d-none')
    $('#contact').removeClass('d-none')
    $("#contactLoading").fadeOut(300)

    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputFocused = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputFocused = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
            phoneInputFocused = true
            console.log(true);
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputFocused = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputFocused = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputFocused = true
    })

}



let nameInputFocused = false;
let emailInputFocused = false;
let phoneInputFocused = false;
let ageInputFocused = false;
let passwordInputFocused = false;
let repasswordInputFocused = false;




function inputsValidation() {
    if (nameInputFocused) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputFocused) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputFocused) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputFocused) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputFocused) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputFocused) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    // return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
    // return 1;
    return (/^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
    // return 1
}

