window.onload = function() {
    document.getElementById('searchBox').value = '';
    }
let search;
let searchedMealData;
var localData = localStorage.getItem('favData');
let favoutriteData = localData ? JSON.parse(localData) : [];
const setValue = function () {
    let selectedId = event.target.id;                                            //Getting the Id of selected options from the suggestions
    let selectedOption = document.getElementById(selectedId).innerHTML;           //Getting the selected option
    document.getElementById('searchBox').value = selectedOption;                  //Setting the selected option value in the text box 
    //Removing the recommendation layout after selecting any recommended option
    document.getElementById("mealItem").innerHTML = "";
    document.getElementById('suggestionBox').setAttribute('style', 'height:auto');
}

const getData = function () {
    let elements = [];
    search = document.getElementById("searchBox").value;
    if (!search) {
        //Removing the recommendation layout when search box is empty
        document.getElementById("mealItem").innerHTML = "";
        document.getElementById('suggestionBox').setAttribute('style', 'height:auto');
        return;
    }
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data?.meals?.length > 0) {
                data.meals.map((d) => {
                    if (data.meals.length > 9) { //Making the list scrolllable incase recommended list exceeds 9 options
                        document.getElementById('suggestionBox').setAttribute('style', 'height:300px;overflow-y: auto;')
                    }
                    else {
                        document.getElementById('suggestionBox').setAttribute('style', 'height:auto');
                    }
                    elements.push("<li id='" + 'meal' + d.idMeal + "' onclick='setValue()'>" + d.strMeal + "</li>");
                });
                document.getElementById("mealItem").innerHTML = elements.join(" ");

            }
            else {
                //Removing the recommendation layout incase if the list goes back to less then 9 options
                document.getElementById('suggestionBox').setAttribute('style', 'height:auto');
                document.getElementById("mealItem").innerHTML = "";

            }
        });
}
const debounce = function (fn, d) {
    let timer;
    return function () {
        let context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, d)
    }
}

const recommendations = debounce(getData, 200);

function searchResult() {
    if (!search) {
        document.getElementById("searchResult").innerHTML = "";
        return;
    }
    document.getElementById("mealItem").innerHTML = "";
    let searchData = [];
    const searchValue = document.getElementById("searchBox").value;
    let SearchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    fetch(SearchUrl)
        .then(response => response.json())
        .then(data => {
            searchedMealData = data.meals;
            if (data?.meals?.length > 0) {
                data.meals.map((d) => {
                    searchData.push(
                        `<div class='searchedData'>
                        <img src="${d.strMealThumb}" alt="Meal Thumbnail" style="height:200px;width:200px;border-radius:10px"/>
                        <div class="mealDescription">
                        <p class="mealName" id="mealName${d.idMeal}" name="${d.idMeal}" onclick="mealDetailPage(${d.idMeal})">${d.strMeal}</p>
                        <ul class="mealDetails">
                        <li> Area:${d.strArea}</li>
                        <li> Category:${d.strCategory}</li>
                        </ul>
                        <button style="${(favoutriteData.includes(d.idMeal) ? "background-color:red" : "")}" id="${d.idMeal}" onclick="favouriteMeal()">${(favoutriteData.includes(d.idMeal) ? "Added" : "Favourite")}</button>
                        </div>
                        </div>`)
                });
                document.getElementById("suggestionBox").setAttribute('style', 'height:auto');
                document.getElementById("searchResult").innerHTML = searchData.join(" ");

            }
            else {
                document.getElementById('searchResult').setAttribute('style', 'height:auto');
                document.getElementById("searchResult").innerHTML = "";

            }
        });
}

function favouriteMeal() {

    let mealSelected = event.target.id;
    let currentValue = document.getElementById(mealSelected).innerText;
    if (currentValue == 'Favourite') {
        favoutriteData.push(mealSelected);
        document.getElementById(mealSelected).innerText = "Added";
        document.getElementById(mealSelected).setAttribute("style", `background-color:red;margin-top:10px;margin-left:40px;padding:10px;width:90px;border:none;border-radius:10px;color:rgb(246, 247, 247);font-size:medium;cursor:pointer;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;`);
    }
    else {
        favoutriteData = favoutriteData.filter(el => el !== mealSelected);
        document.getElementById(mealSelected).innerText = "Favourite";
        document.getElementById(mealSelected).setAttribute("style", `background-color:rgb(71, 103, 248);margin-top:10px;margin-left:40px;padding:10px;width:90px;border:none;border-radius:10px;color:rgb(246, 247, 247);font-size:medium;cursor:pointer;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;`);
    }
    localStorage.setItem("favData", JSON.stringify(favoutriteData));
}

function mealDetailPage(searchMeal) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${searchMeal}`)
        .then(response => response.json())
        .then(data => {
            let d = data.meals[0];
            let detailPageLayout = (
                `<html>
                <head><title>Meal Detail</title></head>
                <body>
                <div style='background-image: url(./pexels-fwstudio-129731.jpg);background-position: center;background-repeat: repeat;min-height:1000px;display:flex;justify-content:center' >
                <div class='detailPage' style='display:flex;justify-content:center;align-items:center;flex-direction:column;margin:30px;width:50%;height:auto;background-color:#fff;border-radius:10px'>
                <h1>${d.strMeal}</h1>
                <img src="${d.strMealThumb}" alt="Meal Thumbnail" style="height:400px;width:400px;border-radius:10px"/>
                <div class="foodDetails">
                <ul class="mealDetails">
                <li> Area:'${d.strArea}'</li>
                <li> Category:'${d.strCategory}'</li>
                <li> Cooking Instruction:<p>${d.strInstructions}</p></li>
                </ul>
                </div>
                </div>
                </div>
                </body>
                </html>`
            )
            window.open().document.write(detailPageLayout);
        });
}

function favouriteList() {
    let listData;
    let body = [];
    favoutriteData.map((d) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${d}`)
            .then(response => response.json())
            .then(data => {
                let list = data.meals[0];
                listData =
                    `<html>
            <head><title>Favourite Meals</title></head>
            <body>
                ${body.push(`
                <div style="font-size:xx-large;align-content:center;margin:5px;padding:5px;background-color:#fff;width:100%;border-radius:10px;display:flex;flex-direction:row">
                <img src=${list.strMealThumb} alt="Meal Thumbnail" style="height:200px;width:200px;border-radius:10px"/>
                <div style="display:flex;flex-direction:column">
                <p style="color:rgb(91,55,252);margin-left:39px;margin-bottom:2px;cursor:pointer" id="mealName${list.idMeal}" name="${list.idMeal}" onclick="mealDetailPage(${list.idMeal})">${list.strMeal}</p>
                <ul style="margin:0;list-style:none;font-size:large">
                <li> Area: ${list.strArea}</li>
                <li> Category: ${list.strCategory}</li>
                </ul>
                <button style="${(favoutriteData.includes(list.idMeal) ? "background-color:red" : "background-color:rgb(71, 103, 248)")};margin-top:10px;margin-left:40px;padding:10px;width:90px;border:none;border-radius:10px;color:rgb(246, 247, 247);font-size:medium;cursor:pointer;font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;" id="${list.idMeal}" onclick="favouriteMeal()">${(favoutriteData.includes(list.idMeal) ? "Added" : "Favourite")}</button>
                </div>
                </div>
                `)}
                ${document.getElementById("searchResult").innerHTML = body.join(" ")}
            </body>
            </html>`;
                document.getElementById("searchResult").innerHTML = listData;
            });
    });
}
