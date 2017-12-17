
//Array declaration
var deals:{ transport: string, departure: string, arrival: string, duration: { h: string, m: string }, cost: number, discount: number, reference: string }[] = [];
var fromLoc: string[] = [];
var dealFound:{ transport: string, departure: string, arrival: string, duration: { h: string, m: string }, cost: number, discount: number, reference: string }[] = [];
var results:{ transport: string, departure: string, arrival: string, duration: { h: string, m: string }, cost: number, discount: number, reference: string }[] = [];
var points:{ departure: string, arrival: string}[] = [];
var Connection:{ transport: string, departure: string, arrival: string, duration: { h: string, m: string }, cost: number, discount: number, reference: string }[]= [];
var all_ab_connections:{ departure: string, arrival: string }[] = []; 
var all_depXcon: { departure: string, arrival: string }[] = [];
var all_arrival_for_a_spec_dep_CLONE:{ departure: string, arrival: string }[] = [];
var startPoint: { departure: string, arrival: string }[] = [];
var endPoint: { departure: string, arrival: string }[] = [];
var pathfinder: { departure: string, arrival: string }[] = [];
//-----End ---------

//Variable declarion
var steDeparture: string = '';
var strArrival: string = '';
var strSortBy: string = '';
var starting_point: string = '';
var ending_point: string = '';
var end_point_D_A: string = '';
var end_point_D: string = '';
var end_point_A: string = ''
var end_point_minus1_D_A: string = ''
var end_point_minus1_D: string = '';
var end_point_minus1_A: string = '';
var star_point_plus1_D_A: string = ''
var star_point_plus1_D: string = '';
var star_point_plus1_A: string = '';
var pathFindDeparture: string = '';
var pathFindArrival: string = '';
var pathFound: boolean = false;
//-----End ---------


$(document).ready(function (e) {
    //Readind the JSON file
    //if you are unable to load the file from the server deployed version then in the fail() function manually loaded for testing purpose
    //Sometime you might not configured .JSON MIME in you pc so you have to use the .js file
    var jsonURL = "../../models/response.js";
    $.getJSON(jsonURL, function (data) {
        $.each(data.deals, function (key, val) {
            deals.push(val);
            chkLoc(val.departure);
            chkLoc(val.arrival);
        });
    }).fail(function (d, textStatus, error) {
            var data = dataJSON;
            points = dataJSON;
            $.each(data[0].deals, function (key, val) {
                deals.push(val);
                chkLoc(val.departure);
                chkLoc(val.arrival);

                if (!chkConnetion(val)) {
                    Connection.push({ 'departure': val.departure, 'arrival': val.arrival })
            }
            });
        });
});

function chkConnetion(val: string) {
    if (Connection.length > 0) {
        for (var i = 0; i < Connection.length; i++) {
            if (Connection[i].departure === val.departure && Connection[i].arrival === val.arrival)
                return true
        }

        return false;
    }
    return false;
}

function chkLoc(strLoc: string) {
    //Filling the FromLocation (Departure)
    if (fromLoc.length > 0) {
        if ($.inArray(strLoc, fromLoc) != -1) {
            // found it
            return false;
        }
    }
    fromLoc.push(strLoc);
    $(".ddlFrom").append("<option value=\"" + $.trim(strLoc) + "\">" + $.trim(strLoc) + "</option>");
}


function tripFinder() {
    $('.dvTripWrapper').empty();
    $('#spnTot').text('0');
    $('#spnHr').text('0');
    $('#spnM').text('0');
    var isTripFind: boolean = false;
    steDeparture = $.trim($("#ddlFrom option:selected").text());
    strArrival = $.trim($("#ddlTo option:selected").text());

    if (deals.length > 0) {
        console.log('This is to find any direct deals');
        dealFound = [];
        for (var i = 0; i < deals.length; i++) {
            if (deals[i].departure === steDeparture && deals[i].arrival === strArrival) {
                isTripFind = true;
                dealFound.push(deals[i]);
            }
        }
        if (isTripFind === true) {
            if (dealFound.length > 1) {
                sort(dealFound);
            }
        }

        if (isTripFind == false)
            getInDirectTrip();
    }
}

var trip = [];
//If users select different combinations
function getInDirectTrip() {
    pathFound = false;
    pathFindDeparture = '';
    pathFindArrival = '';
    startPoint = [];
    endPoint = [];
    trip = [];
    all_ab_connections = [];

    $('.dvTripWrapper').empty();

    //1st Entry Point
    traverse(steDeparture, strArrival);

    //2nd Entry Point
    init(startPoint, steDeparture)

    if (!pathFound) {
        pathFinderResult();

        if (!pathFound) {
            all_arrival_for_a_spec_dep_CLONE = all_arrival_for_a_spec_dep.slice();
            //all_arrival_for_a_spec_dep=[];

            for (var s = 0; s < startPoint.length; s++) {
                if (!pathFound) {
                    if (startPoint[s].departure === steDeparture) {
                        if (!pathFound) {
                            for (var i = 0; i < all_arrival_for_a_spec_dep.length; i++) {
                                if (!pathFound) {
                                    if (all_arrival_for_a_spec_dep[i].departure === startPoint[s].arrival) {
                                        if (!pathFound) {
                                            for (var x = 0; x < Connection.length; x++) {
                                                if (Connection[x].departure === all_arrival_for_a_spec_dep[i].arrival) {
                                                    if (!pathFound) {
                                                        all_ab_connections.push({ 'departure': startPoint[s].arrival, 'arrival': all_arrival_for_a_spec_dep[i].arrival });
                                                        all_ab_connections.push({ 'departure': Connection[x].departure, 'arrival': Connection[x].arrival });
                                                        pathFound = true;
                                                    }

                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            pathFinderResult();
        }
    }

    if (pathFound) {
        trip = [];
        $('#spnTot').text('0');
        $('#spnHr').text('0');
        $('#spnM').text('0');

        if (pathFindDeparture !== "") {
            trip.push({ 'departure': pathFindDeparture, 'arrival': strArrival });
            getPath(pathFindDeparture);

            for (var i = 0; i < trip.length; i++) {
                if (trip[0].arrival === strArrival && trip[trip.length - 1].departure !== steDeparture) {
                    getPath(trip[trip.length - 1].departure);
                }
            }
        }

        if (pathFindDeparture === "" && trip.length < 1) {
            alert('Cannot find the trip');
        }
        else {
            if (trip.length > 0) {
                for (var i = [trip.length - 1]; i >= 0; i--) {
                    if (trip[i].departure !== "" && trip[i].arrival !== "")
                        getIndirectDeals(trip[i].departure, trip[i].arrival);
                }
            }
        }
    }
}


function getPath(loc: string) {
    //debugger;
    var isFound:boolean = false;
    for (i = 0; i < all_ab_connections.length; i++) {
        if (!isFound) {
            if (isFound === false && all_ab_connections[i].arrival === loc) {
                isFound = true;
                trip.push({ 'departure': all_ab_connections[i].departure, 'arrival': all_ab_connections[i].arrival });
            }
        }
    }
}

function getIndirectDeals(from: string, to: string) {
    var isTripFind: boolean = false;
    if (deals.length > 0) {
        console.log('This is to find the indirect trip deals');
        dealFound = [];
        for (var i = 0; i < deals.length; i++) {
            if (deals[i].departure === from && deals[i].arrival === to) {
                isTripFind = true;
                dealFound.push(deals[i]);
            }
        }
        if (isTripFind === true) {
            if (dealFound.length > 1) {
                sort(dealFound);
            }
        }
    }
}


function traverse(a: string, b: string) {
    //debugger;
    all_ab_connections = [];
    startPoint = [];
    endPoint = [];

    var isFound = false;
    if (Connection.length > 0) {
        for (var i = 0; i < Connection.length; i++) {
            if (Connection[i].departure === a) {
                all_ab_connections.push({ 'departure': Connection[i].departure, 'arrival': Connection[i].arrival });
                startPoint.push({ 'departure': Connection[i].departure, 'arrival': Connection[i].arrival });
            }

            if (Connection[i].arrival === b) {
                all_ab_connections.push({ 'departure': Connection[i].departure, 'arrival': Connection[i].arrival });
                endPoint.push({ 'departure': Connection[i].departure, 'arrival': Connection[i].arrival });
            }
        }
    }
}

var all_arrival_for_a_spec_dep = [];

function init(array, dep: string) {
    all_arrival_for_a_spec_dep = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].departure == dep) {
            pathfinder_arrival(array[i].arrival, dep);
        }
    }
}



//all arrivals for a specific departure
function pathfinder_arrival(dep: string, key) {
    //debugger;
    for (var i = 0; i < Connection.length; i++) {
        if (Connection[i].departure === dep) {
            //debugger;
            if (Connection[i].arrival !== key)
                all_arrival_for_a_spec_dep.push({ 'departure': dep, 'arrival': Connection[i].arrival })
        }
    }
}


function pathFinderResult() {
    //debugger;
    var isFound:boolean = false;

    if (startPoint.length > 0 && endPoint.length > 0) {
        for (var i = 0; i < startPoint.length; i++) {
            for (var x = 0; x < endPoint.length; x++) {
                if ((startPoint[i].departure === steDeparture) && (startPoint[i].arrival === endPoint[x].departure)) {
                    isFound = true;
                    pathFound = true;
                    pathFindDeparture = endPoint[x].departure;
                    pathFindArrival = startPoint[i].arrival;
                    return true;
                }
            }
        }
    }

    for (var i = 0; i < all_ab_connections.length; i++) {
        var findArrival = all_ab_connections[i].arrival;
        if (!isFound) {
            for (var x = 0; x < endPoint.length; x++) {
                if (!isFound) {
                    var findDeparture = endPoint[x].departure;
                    if (findArrival === findDeparture) {
                        isFound = true;
                        pathFound = true;
                        pathFindDeparture = findDeparture;
                        pathFindArrival = findArrival;
                        return true;
                    }
                }
            }
        }
    }
}

function sort(jsObj) {
    results = [];
    var sorted_by_cost = [];
    if (strSortBy !== "") {
        if (strSortBy === 'COST')
            sorted_by_cost = jsObj.sort((a, b) => a.cost > b.cost);
        else {
            sorted_by_cost = jsObj.sort((a, b) => a.duration.h > b.duration.h);
        }
    }
    else
        sorted_by_cost = jsObj;
     
    for(let k in sorted_by_cost) {
        results.push(sorted_by_cost[k])
    }

    getTripBind();
}


function reset() {
    steDeparture = '';
    strArrival = '';
    strSortBy = '';
    starting_point = '';
    ending_point = '';
    end_point_D_A = '';
    end_point_D = '';
    end_point_A = ''
    end_point_minus1_D_A = ''
    end_point_minus1_D = '';
    end_point_minus1_A = '';
    star_point_plus1_D_A = ''
    star_point_plus1_D = '';
    star_point_plus1_A = '';
    pathFindDeparture = '';
    pathFindArrival = '';
    pathFound = false;

    dealFound = [];
    results = [];

    $('#ddlFrom > option[value="0"]').prop('selected', true);
    $('.ddlTo').find('option').remove().end().append('<option>Trip To (Arrive At)</option>');
    $('.dvTripWrapper').empty();
    $('.rdSortBy').prop('checked', false);
    $('#spnTot').text("0");
    $('#spnHr').text("0");
    $('#spnM').text("0");
}


function getTripBind() {
    if (results.length > 0) {
        if (strSortBy !== "") {
            var steBuilder: string = '';
            steBuilder += '<br />';
            steBuilder += '<div class="col-md-7 wrapper">';
            steBuilder += '<h3>' + results[0].departure + ' > ' + results[0].arrival + ' <span onclick="displayImg();" class="img-image"><img src="../public/images/find.png" style="height:25px; width:25px; cursor:pointer" title="Place that you can visit"/></span>' + '        ' + results[0].cost + '€ - ' + (parseInt($.trim(results[0].cost)) * (parseInt(results[0].discount) / 100)) + '€ = ' + (parseInt($.trim(results[0].cost) - (parseInt($.trim(results[0].cost)) * (parseInt(results[0].discount) / 100)))) + '€</h3>';
            if (results[0].transport == 'train')
                steBuilder += '<p><img src="../public/images/train.png" style="height:60px; width:60px" />  <b>Train  </b> ';
            if (results[0].transport == 'bus')
                steBuilder += '<p><img src="../public/images/bus.png" style="height:60px; width:60px" />  <b>Bus  </b>';
            if (results[0].transport == 'car')
                steBuilder += '<p><img src="../public/images/car.png" style="height:60px; width:60px" />  <b>Car  </b> ';
            steBuilder += '  ' + results[0].reference;
            steBuilder += '  for ' + results[0].duration["h"] + 'h :' + results[0].duration["m"] + 'm';
            if (strSortBy == 'COST')
                steBuilder += '   <span style="color:red; font-size:12px"><b>Cheapest      Discount :</b> ' + results[0].discount + '%  </span>  ';
            if (strSortBy == 'FAST')
                steBuilder += '   <span style="color:red; font-size:12px"><b>Fastest     Discount :</b> ' + results[0].discount + '%  </span>  ';
            steBuilder += '</div>';
            steBuilder += '<br />';

            $('.dvTripWrapper').append(steBuilder);

            $('#spnHr').text((parseInt($.trim(results[0].duration["h"]))) + (parseInt($.trim($('#spnHr').text()))))
            $('#spnM').text((parseInt($.trim(results[0].duration["m"]))) + (parseInt($.trim($('#spnM').text()))))

            if (parseInt($.trim($('#spnM').text())) > 59) {
                $('#spnHr').text(parseInt($.trim($('#spnHr').text())) + 1);
                $('#spnM').text(parseInt($.trim($('#spnM').text())) - 60);

            }
            $('#spnTot').text((parseInt($.trim(results[0].cost) - (parseInt($.trim(results[0].cost)) * (parseInt(results[0].discount) / 100)))) + (parseInt($.trim($('#spnTot').text()))));
        }
        else {
            for (var i = 0; i < results.length; i++) {
                var steBuilder: string = '';
                steBuilder += '<br />';
                steBuilder += '<div class="col-md-5 wrapper">';
                steBuilder += '<h3>' + results[i].departure + ' > ' + results[i].arrival + '<span class="img-image" onclick="displayImg();"><img src="../public/images/find.png" style="height:25px; width:25px; cursor:pointer" title="Place that you can visit" class="img-image" /></span>' + + results[i].cost + '€' + '</h3>';
                if (results[i].transport == 'train')
                    steBuilder += '<p><img src="../public/images/train.png" style="height:60px; width:60px" />  <b>Train  </b> ';
                if (results[i].transport == 'bus')
                    steBuilder += '<p><img src="../public/images/bus.png" style="height:60px; width:60px" />  <b>Bus  </b>';
                if (results[i].transport == 'car')
                    steBuilder += '<p><img src="../public/images/car.png" style="height:60px; width:60px" />  <b>Car  </b> ';
                steBuilder += '  ' + results[i].reference;
                steBuilder += '  for ' + results[i].duration["h"] + 'h :' + results[i].duration["m"] + 'm';
                steBuilder += '  <span style="color:red; font-size:12px"><b>      Discount :</b> ' + results[i].discount + '%  </span>  ';
                steBuilder += '</div>';
                steBuilder += '<br />';
                $('.dvTripWrapper').append(steBuilder);
            }
        }
    }
}

function displayImg() {
    alert('Bonus features - to display tourist attractions pertaining to each destination!!');
}




