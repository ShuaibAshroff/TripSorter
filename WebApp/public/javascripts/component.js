function getTripBind() {
    if (results.length > 0) {
        if (strSortBy !== "") {
            var steBuilder = '';
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
                var steBuilder = '';
                steBuilder += '<br />';
                steBuilder += '<div class="col-md-5 wrapper">';
                steBuilder += '<h3>' + results[i].departure + ' > ' + results[i].arrival + '<span class="img-image" onclick="displayImg();"><img src="../public/images/find.png" style="height:25px; width:25px; cursor:pointer" title="Place that you can visit" class="img-image" /></span>' + +results[i].cost + '€' + '</h3>';
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
