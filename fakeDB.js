// Postgres info Below
// Username: sabine
// Password: QBegumWGEWFeQsEaRNCf7trp

function getLEDMakers(){
  var makers = ["Cree","Citizen","Nichia","Bridgelux","Sharp"];
  return makers;
}

function getLEDModels(maker){
  // https://stackoverflow.com/questions/1144705/best-way-to-store-a-key-value-array-in-javascript
  var LEDMaker = {
    Cree: "CXA1310,CXA1520,CXA1850,CXA2590,CXA3050,CXA3590",
    Citizen: "CLU028,CLU038,CLU048,CLU058",
    Nichia: "NJCWS024Z-V1,NVCWL024Z-V1,NVEWJ048Z-V1",
    Bridgelux: "Vero 10,Vero 13,Vero 18,Vero 29" }

    if(LEDMaker[maker] === undefined){
      console.log("LED Maker \"" + maker + "\" does not have any models...")
    }
    else{
      return LEDMaker[maker].split(",");
    }
}

function getLEDVersions(model){
  var LEDModels = {
    "Vero 13": "3000K, 80CRI<,>4000K, 80CRI" }

    if(LEDModels[model] === undefined){
      console.log("LED Model \"" + model + "\" does not have any versions...");
    }
    else{
      return LEDModels[model].split("<,>");
    }
}

function getVersionAttrs(model,version){
  var versions = {
    "3000K, 80CRI": {
      modelID:"1",partNumber:"BXRC-30E4000-B-7x",DSLink:"https://www.bridgelux.com/sites/default/files/resource_media/Bridgelux%20DS92%20Vero%2018%20Gen%207%20Array%20Data%20Sheet%2020180403%20Rev%20L.pdf",nomVf:34.8,minVf:32.2,maxVf:37.4,nomCurrent:900,minCurrent:90,maxCurrent:1800,nomFlux:5000,minFlux:4500,CCT:3000,nomCRI:80,typCRI:80,TjTc:"Tj",temp:25},
    "4000K, 80CRI": {}}

    // y = 5.61952080861331E-09x3 - 5.26792404470511E-06x2 + 6.41412554034515E-03x + 6.64724455408106E-04
    versions[version].flux_of_I_C3 = 5.61952080861331e9;
    versions[version].flux_of_I_C2 = 5.26792404470511e6;
    versions[version].flux_of_I_C1 = 6.41412554034515e3;
    versions[version].flux_of_I_C0 = 6.64724455408106e4;

    // y = -2.0168067227E-06x2 - 1.5188515406E-03x + 1.0392004202E+00
    versions[version].flux_of_Tj_C3 = 0;
    versions[version].flux_of_Tj_C2 = -2.0168067227e6;
    versions[version].flux_of_Tj_C1 = -1.5188515406e3;
    versions[version].flux_of_Tj_C0 = 1.0392004202;

    // y = -1.0466514655E-06x2 + 9.5305014921E-04x + 8.6893124315E-01
    versions[version].vf_of_I_C3 = 0;
    versions[version].vf_of_I_C2 = -1.0466514655e6;
    versions[version].vf_of_I_C1 = 9.5305014921e4;
    versions[version].vf_of_I_C0 = 8.6893124315e1;

    // y =  - 2.4000000000E-02
    versions[version].vf_of_Tj_C3 = 0;
    versions[version].vf_of_Tj_C2 = 0;
    versions[version].vf_of_Tj_C1 = 0;
    versions[version].vf_of_Tj_C0 = -2.4000000000e2;

    // y = -2.8260815967E-07x2 + 6.2516135462E-04x + 1.3035932093E+00
    versions[version].Rth_of_I_C3 = 0;
    versions[version].Rth_of_I_C2 = -2.8260815967e7;
    versions[version].Rth_of_I_C1 = 6.2516135462e4;
    versions[version].Rth_of_I_C0 = 1.3035932093;

    // y = -5.9993464479E-08x2 - 1.9999424874E-05x + 5.0133255996E-04
    // CIEx_of_Tj

    //y = 1.9997821493E-07x2 - 1.0000191709E-04x + 2.4955581335E-03
    //CIEy_of_Tj

    return versions[version];
}

function getVersionsRelationships(){

}

function LEDobj(LEDModel,Version){

  var LEDVersions = {
  "Vero 10": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"},
  "Vero 13": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"},
  "Vero 18": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"},
  "Vero 29": {
    "27E":"2700K, 80CRI","30E":"3000K, 80 CRI","40E":"4000K, 80 CRI","50C":"5000K, 70 CRI"}
  };

  var versions = LEDVersions[LEDModel];
  console.log("Versions are: " + versions);

  return "LEDobj function has run.";
}
// https://javascript.info/class
class LED {

  constructor(name){
    this.name = name;
    this.nomVf = 0
    this.nomI = 0;
    this.notLum = 0;
    this.nomPow = 0;
  }

  getLum(current, temp){
  // return lumens based on current and temperature
    return 0;
  }

  getVf(current, temp){
  // return voltage based on current and temperature
      return 0;
  }

  getPow(current, temp){
    return getVf(current, temp) * current;
  }
}
