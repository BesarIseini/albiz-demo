let data;
let yearID = 0, compareYearID = 0, budgetYearID;
let mainMuncipality = 0, compareOneMun = 1000, compareTwoNum = 1000,
budgetMunicipality1 = 12, budgetMunicipality2 = 12;
let employed, unemployed;
let currentYearAndMuncipality;


google.charts.load("current", { packages: ["corechart"] });
google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawChart);

async function getData() {
    let x = await fetch("./assets/data/newEmployed.json");
    let y = await x.json();
    console.log(y.komunat);
    data = y.komunat;
    

    logCurrent();
}
getData();

document.getElementById("Select1").addEventListener("input", function () {
    console.log("changed");
    const Valuee = document.querySelector("#Select1").value;
    if (!Valuee) return;
    const Text = document.querySelector('option[value="' + Valuee + '"]').label;
    const option = document.createElement("option");
    option.value = Valuee;
    option.text = Text;

    select = option.value;

    komunaID(select, 0);
});

function komunaID(select, nr) {
    let municipalityNR = 0;
    if(select !== "All") {
        document.getElementById('tableEnable').style.display = 'none'
        document.getElementById('chartEnable').style.display = 'block'
    }
    if (select === "Saraj") {
        municipalityNR = 0;
    } else if (select === "Karposh") {
        municipalityNR = 1;
    } else if (select === "Tetovo") {
        municipalityNR = 2;
    } else if (select === "Cair") {
        municipalityNR = 3;
    } else if (select === "Skopje") {
        municipalityNR = 4;
    } else if (select === "Struga") {
        municipalityNR = 5;
    } else if (select === "Gostivar") {
        municipalityNR = 6;
    } else if (select==="All") {
        console.log('test')
        tableDraw();
        document.getElementById('tableEnable').style.display = 'block'
        document.getElementById('chartEnable').style.display = 'none'
        
    } else {
        return;
    }

    switch (nr) {
        case 0:
            mainMuncipality = municipalityNR;
            break;
        case 1:
            compareOneMun = municipalityNR;
            break;
        case 2:
            compareTwoNum = municipalityNR;
            break;
        case 3:
            budgetMunicipality1 = municipalityNR
            break;
        case 4:
            budgetMunicipality2 = municipalityNR
            break;
        default:
            break;
    }

    yearSelect(nr);
}

function yearSelect(nr) {


    if(nr === 2) {nr--}
    else if(nr === 4) {nr--}
    let YearSelect = document.getElementById("vitit" + nr).value;
    let yearNR = 0;
    console.log(YearSelect)
    if (YearSelect == 2018) {
        yearNR = 0;
    } else if (YearSelect == 2019) {
        yearNR = 1;
    } else if (YearSelect == 2020) {
        yearNR = 2;
    } else if (YearSelect == 2021 || YearSelect == 2022) {
        yearNR = 3;
    } else if (YearSelect == 'All') {
        
        document.getElementById('line').style.display = 'block'
        document.getElementById('pie').style.display = 'none'
        drawCurveTypes()
    }

    if(YearSelect !== "All") {
        document.getElementById('pie').style.display = 'block'
        document.getElementById('line').style.display = 'none'
    }

    console.log(yearNR, nr)
    switch (nr) {
        case 0:
            yearID = yearNR;
            break;
        case 1: 
            compareYearID = yearNR;
            drawChart2()
            drawChart3()
            break;
        // case 2: 
        //     compareYearID = yearNR;
        //     drawChart3()
        //     drawChart2()
        //     break;
        case 3:
            budgetYearID = yearNR
            drawChart4();

            break;
        default:
            break;
    }

    // console.log(yearID, mainMuncipality); //CONSOLE HERE
    logCurrent();
}

function gender() {
    logCurrent();
}

function gender1(cYAM) {
    GenderSelect = document.getElementById("gjinia").value;
    if (GenderSelect == "males") {
        console.log("test");
        employed = cYAM.meshkuj_me_pun;
        unemployed = cYAM.meshkuj_pa_pun;
    } else if (GenderSelect == "females") {
        employed = cYAM.femna_me_pun;
        unemployed = cYAM.femna_pa_pun;
    }
    drawChart();
    tableDraw()
}

function logCurrent() {
    currentYearAndMuncipality = data[mainMuncipality].vitet[yearID];
    gender1(currentYearAndMuncipality);
}

function drawChart() {
    var pieData = google.visualization.arrayToDataTable([
        ["Task", "Hours per Day"],
        ["Employed", employed],
        ["Unemployed", unemployed],
    ]);

    var options = {
        title: "Municipality of " + data[mainMuncipality].komuna,
    };

    var chart = new google.visualization.PieChart(document.getElementById("myChart"));

    chart.draw(pieData, options);
}

document.getElementById("komunatCompare1").addEventListener("input", function () {
    const Valuee = document.querySelector("#komunatCompare1").value;

    if (!Valuee) return;

    const Text = document.querySelector('option[value="' + Valuee + '"]').label;

    const option = document.createElement("option");
    option.value = Valuee;
    option.text = Text;

    select = option.value;

    komunaID(select, 1);
});

document.getElementById("komunatCompare2").addEventListener("input", function () {
    const Valuee = document.querySelector("#komunatCompare2").value;

    if (!Valuee) return;

    const Text = document.querySelector('option[value="' + Valuee + '"]').label;

    const option = document.createElement("option");
    option.value = Valuee;
    option.text = Text;

    select = option.value;

    komunaID(select, 2);
});

function yearSelectComapare() {


}

function drawChart2() {
    let cYAM = data[compareOneMun].vitet[compareYearID]
    console.log(cYAM)
    var pieData = google.visualization.arrayToDataTable([
        ["Task", "Hours per Day"],
        ["Employed Public Sector", cYAM.publik],
        ["Employed Priavte Sector", cYAM.privat],
        ["Unemployed", cYAM.pa_pun],
    ]);

    var options = {
        title: "Municipality of " + data[compareOneMun].komuna,
        legend: {
            position: 'left'
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById("myChart2"));

    chart.draw(pieData, options);


    document.getElementById('municipality').innerHTML = data[compareOneMun].komuna;
    document.getElementById('population').innerHTML = cYAM.populsi
    document.getElementById('employed').innerHTML = cYAM.me_pun
    document.getElementById('public_work').innerHTML = cYAM.publik
    document.getElementById('private_work').innerHTML = cYAM.privat
    document.getElementById('unemployed').innerHTML = cYAM.pa_pun
}

function drawChart3() {
    let cYAM = data[compareTwoNum].vitet[compareYearID]
    console.log(cYAM)
    var pieData = google.visualization.arrayToDataTable([
        ["Workforce", "Employees"],
        ["Employed Public Sector", cYAM.publik],
        ["Employed Priavte Sector", cYAM.privat],
        ["Unemployed", cYAM.pa_pun],
    ]);

    var options = {
        title: "Municipality of " + data[compareTwoNum].komuna,
    };

    var chart = new google.visualization.PieChart(document.getElementById("myChart3"));

    chart.draw(pieData, options);

    document.getElementById('municipality2').innerHTML = data[compareTwoNum].komuna;
    document.getElementById('population2').innerHTML = cYAM.populsi
    document.getElementById('employed2').innerHTML = cYAM.me_pun
    document.getElementById('public_work2').innerHTML = cYAM.publik
    document.getElementById('private_work2').innerHTML = cYAM.privat
    document.getElementById('unemployed2').innerHTML = cYAM.pa_pun
}

document.getElementById("budget1").addEventListener("input", function () {
    const Valuee = document.querySelector("#budget1").value;

    if (!Valuee) return;

    const Text = document.querySelector('option[value="' + Valuee + '"]').label;

    const option = document.createElement("option");
    option.value = Valuee;
    option.text = Text;

    select = option.value;

    komunaID(select, 3);
});

document.getElementById("budget2").addEventListener("input", function () {
    const Valuee = document.querySelector("#budget2").value;

    if (!Valuee) return;

    const Text = document.querySelector('option[value="' + Valuee + '"]').label;

    const option = document.createElement("option");
    option.value = Valuee;
    option.text = Text;

    select = option.value;

    komunaID(select, 4);
});

function drawChart4() {
    let cYAM1 = data[budgetMunicipality1].vitet[budgetYearID]
    let cYAM2 = data[budgetMunicipality2].vitet[budgetYearID]
    var pieData = google.visualization.arrayToDataTable([
        ["Task", "Hours per Day"],
        [data[budgetMunicipality1].komuna, cYAM1.budget],
        [data[budgetMunicipality2].komuna, cYAM2.budget],
    ]);

    var options = {
        title: "Budget Comparison ",
    };

    var chart = new google.visualization.PieChart(document.getElementById("myChart4"));

    chart.draw(pieData, options);
}


function tableDraw() {
    let x = 0;
    var Tabledata = new google.visualization.DataTable();
    Tabledata.addColumn('string', 'Name');
    Tabledata.addColumn('number', 'Population');
    Tabledata.addColumn('number', 'Employeed');
    Tabledata.addColumn('number', 'Unemployed');
    Tabledata.addColumn('number', 'Public Sector');
    Tabledata.addColumn('number', 'Private Sector');
    Tabledata.addColumn('number', 'Employeed Males');
    Tabledata.addColumn('number', 'Employeed Females');
    Tabledata.addColumn('number', 'Unemployeed Males');
    Tabledata.addColumn('number', 'Unemployeed Females');
    Tabledata.addColumn('number', 'Budget');
    // data.addColumn('boolean', 'Full Time Employee');
    for(let i = 0; i < data.length; i++) {
        let cYAM = data[i].vitet[yearID]
        Tabledata.addRows([
      [
        data[i].komuna, 
        cYAM.populsi, 
        cYAM.me_pun, 
        cYAM.pa_pun, 
        cYAM.publik, 
        cYAM.privat, 
        cYAM.meshkuj_me_pun, 
        cYAM.femna_me_pun,
        cYAM.meshkuj_pa_pun,
        cYAM.femna_pa_pun,
        cYAM.budget
    ],
    //   ['Jim',   {v:8000,   f: '$8,000'},  false],
    //   ['Alice', {v: 12500, f: '$12,500'}, true],
    //   ['Bob',   {v: 7000,  f: '$7,000'},  true]
    ]);

    }


    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(Tabledata, {showRowNumber: true, width: '100%', height: '100%'});
}

function drawCurveTypes() {
    var chartData = new google.visualization.DataTable();
    chartData.addColumn('number', 'X');
    chartData.addColumn('number', `Employed`);
    chartData.addColumn('number', 'Unemployed');

    for(let i = 0; i < data[mainMuncipality].vitet.length; i++){
        let cYAM = data[mainMuncipality].vitet[i]
        console.log(cYAM)
        chartData.addRows([
    [
        cYAM.viti, 
        cYAM.me_pun, 
        cYAM.pa_pun]
    ]);
    // ,    [2019, 1, 10005],   [2020, 1, 1500],  [2021, 1, 900]
}
    var options = {
      hAxis: {
        title: 'Time',
        format: '#'
      },
      vAxis: {
        title: 'Popularity',
        format: '#'
        
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);
  }

drawCurveTypes()