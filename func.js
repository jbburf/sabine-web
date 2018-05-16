/*
 *  UI functions
 */

function pageLoad(){
  var maker = decodeURI(getURIParams("mk"));
  var model = decodeURI(getURIParams("md"));
  var version = decodeURI(getURIParams("vr"));
  var makerPassed = (maker !== null);
  var modelPassed = (model !== null);
  var versionPassed = (version !== null);

  if(makerPassed){
    loadDropDown("inputGroupSelect01",getLEDMakers());
    try{ document.getElementById("inputGroupSelect01").options[getOptionIndex("inputGroupSelect01",maker)].selected = true; }
    catch(err){
      console.log("Failed to set LED maker dropdown: " + err.message);
      makerPassed = false; }
    loadDropDown("inputGroupSelect02",getLEDModels(maker));
  }

  if(modelPassed){
    loadDropDown("inputGroupSelect02",getLEDModels(maker));
    try{ document.getElementById("inputGroupSelect02").options[getOptionIndex("inputGroupSelect02",model)].selected = true; }
    catch(err){
      console.log("Failed to set LED model dropdown: " + err.message);
      modelPassed = false; }
    loadDropDown("inputGroupSelect03",getLEDVersions(model));
  }

  if(versionPassed){
    loadDropDown("inputGroupSelect03",getLEDVersions(model));
    try{ document.getElementById("inputGroupSelect03").options[getOptionIndex("inputGroupSelect03",version)].selected = true; }
    catch(err){
      console.log("Failed to set LED version dropdown: " + err.message);
      versionPassed = false; }
  }

  if(makerPassed && modelPassed && versionPassed) { showLEDInfo(); }

  if(debugFlag){ console.log("Page successfully loaded."); }

  console.log("After pageLoad: ", LEDobj.nom);
}

function getOptionIndex(elementID,optionValue){
  for(var x in document.getElementById(elementID).options){
    if(document.getElementById(elementID).options[x].value == optionValue){
      return x;
    }
  }
  if(debugFlag){ console.log("Element: \"" + elementID + "\" does not contain an option with value= \"" + optionValue + "\"."); }
}

function loadDropDown(dropDownId, contents){
  var targetDropDown = document.getElementById(dropDownId);

  clearDropDown(dropDownId);

// Add original option back, "Choose..."
  var newOption = document.createElement("option");
  newOption.text = "Choose...";
  newOption.selected = true;
  newOption.disabled = true;
  targetDropDown.add(newOption);

// loop to add all elements to dropdown based on original dropdown input
  for (var x in contents) {
    var newOption = document.createElement("option");
    newOption.text = contents[x];
    newOption.value = contents[x];
    targetDropDown.add(newOption);
    }
}

function dropDownSelection(dropDownId){
  return document.getElementById(dropDownId).value;
}

function clearDropDown(dropDownId){
  var dropDown = document.getElementById(dropDownId);

  for (var x in dropDown) {
    dropDown.remove(x);
  }
}

function changeBSProgressBar(progressBarId, newValue){
  $('#' + progressBarId).width(newValue + "%").attr("aria-valuenow", newValue);

    if(debugFlag){ console.log("Progress slider set to: " + newValue + "%."); }

}

function setSlider(sliderID, min, current, max){
  var slider = document.getElementById(sliderID);

  document.getElementById(sliderID + "Value").innerHTML = current;

  slider.min = min;
  slider.value = current;
  slider.max = max;

  if(debugFlag){ console.log("Slider '" + sliderID + "' has been set."); }

}

function showLEDInfo(){
  var model = document.getElementById("inputGroupSelect02").value;
  var version = document.getElementById("inputGroupSelect03").value;

  LEDobj = new LED("LED1",model,version);

  var power = roundTo(LEDobj.nom.vf * LEDobj.nom.i/1000,1);
  var efficacy = roundTo(LEDobj.nom.flux / power,0);

  let tableVis = document.getElementById("LED-info");
  let sliderVis = document.getElementById("slider-section");
  if(tableVis.style.display = "none"){ tableVis.style.display = "block";}
  if(sliderVis.style.display = "none"){ sliderVis.style.display = "block";}

  document.getElementById("LEDImage").src = "assets/LED-" + model + ".jpg";
  document.getElementById("partNumber").innerHTML = LEDobj.partNumber;
  document.getElementById("DSLink").href = LEDobj.DSLink;
  document.getElementById("nomPower").innerHTML = LEDobj.nom.vf + " volts, " + LEDobj.nom.i + "mA (" + power + " watts)";
  document.getElementById("nomFlux").innerHTML = LEDobj.nom.flux + " lm";
  document.getElementById("minFlux").innerHTML = LEDobj.min.flux + " lm";
  document.getElementById("TjTc").innerHTML = LEDobj.nom.TjTc;
  document.getElementById("temp").innerHTML = LEDobj.nom.temp[LEDobj.nom.TjTc] + "&#8451;";
  document.getElementById("nomEfficacy").innerHTML = efficacy + " lm/W";

  document.getElementById("tempSource").innerHTML = LEDobj.nom.TjTc;
  setSlider("tempSlider",-40,25,125);   // NEED to update this to set slider and toggle based on LED inputs
  setSlider("currentSlider",LEDobj.min.i,LEDobj.nom.i,LEDobj.max.i);

  if(debugFlag){ console.log("LED info shown for selected LED."); }

}

function calcResults(){
  "use strict";
  let runFlag = false;
  let runCount = 0;
  let message = "";

  return function(){
    runCount++;
    if(runCount == 1){ message = "once"; }
    else{ message = runCount + " times"; }

    // pull new inputs from the sliders
    let tempSource = document.getElementById("tempSource").innerHTML;
    let current = document.getElementById("currentSlider").value;
    let temp = {};
    temp[tempSource] = document.getElementById("tempSlider").value;

    // calculate new LED state
    console.log("Before entering calcLED: ", LEDobj.nom);
    LEDobj.calcLED(current,temp[tempSource],tempSource);

    if(debugFlag){ console.log("Results have been calculated " + message + ". " + LEDobj.nom.TjTc + ": " + LEDobj.now.temp[LEDobj.nom.TjTc] + " and I: " + LEDobj.now.i + " mA."); }
    console.log("Current status of LED: Vf=" + LEDobj.now.vf + " Flux=" + LEDobj.now.flux + " Power=" + LEDobj.getPow() + " Efficacy=" + LEDobj.getFlux() / LEDobj.getPow() + ".");

    // show results in the output section
    var flux = LEDobj.getFlux();
    var vf = LEDobj.getVf();
    var power = LEDobj.getPow();
    document.getElementById("calcFlux").innerHTML = roundTo(flux,-1);
    document.getElementById("calcPower").innerHTML = roundTo(power,1);
    document.getElementById("calcEfficacy").innerHTML = roundTo(flux/power,1);
    document.getElementById("calcLifeTime").innerHTML = LEDobj.estLifeTime();

    // make result section visible on first run
    if(!runFlag){
      let resultVis = document.getElementById("result-section");
      if(resultVis.style.display = "none"){ resultVis.style.display = "block";}
      runFlag = true;
      if(debugFlag){ console.log("Results calculated and shown."); }
    }
  }
}

//
// General functions
//

function getURIParams(param) {
  // from https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
  var vars = {};
	window.location.href.replace( location.hash, '' ).replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

function roundTo(number,places){
  return Math.round(number * Math.pow(10,places)) / Math.pow(10,places);
}

function formatInt(int,places){
  // fromat so that 50000 becomes 50,000
  return roundTo(int,places);
}
