var known_macs = {};
var update = function(){
var urlapi = urlApiFunction();
  /*   alert(urlapi);
$.get( 'http://localhost:4000/api/noeuds', function(data) {*/
$.get( urlapi, function(data) {
var leases = data;
// Remove previous info
$('#clients').html('');
var total_devices = 0;
for (ip in data) {
var ipinfo = data[ip];
$('#clients').append('<tr>'+
'<td>'+(ipinfo['ip']||'-')+'</td>'+
'<td>'+(ipinfo['client-hostname']||'-')+'</td>'+
'<td class="mono">'+(ipinfo['hardware ethernet']||'-').toUpperCase()+'</td>'+
'</tr>');
total_devices += (ipinfo['client-hostname']) ? 1 : 0;
}
$('#devices').html(total_devices);
$('.mac-manufacturer').each(function(){
var elem = $(this);
var mac = elem.attr('data-mac');
if (typeof known_macs[mac] != 'undefined')
elem.html(known_macs[mac]);
else
$.get('getmac/'+mac, function(data){
elem.html(data);
known_macs[mac] = data;
});
});
});
};
$(document).ready(function(){
update();
var t = setInterval(update, 30000);
});



function urlApiFunction() {
   var ApiUrl = document.getElementById("urlapi").value;
    return ApiUrl;
   
}

/** graph de connexion client  **/

    (function(){
        var urlapi = urlApiFunction();
        var canvas_left_edge = $('#chart-canvas').offset().left;
        var canvas_width = $('#chart-canvas').width();
        var yearsScale;
        alert(urlapi);
       // d3.csv(urlapi, function(data){
            $.get( urlapi, function(data) {
                                    
                
                
            console.log(data);
            // Compute the height our canvas needs to be once we get the data
            var number_of_bars = data.length
            var bar_height = 10;
            var bar_margin_bottom = 8;
            var container_top_padding = 30;
            var container_bottom_padding = 40;
            var canvas_height = number_of_bars * (bar_height + bar_margin_bottom) + container_top_padding + container_bottom_padding;
            $('#chart-canvas').css('height',canvas_height)
            function accessStartDate(d) { return d['starts']; }
            function accessEndDate(d) { return d['ends']; }
            // Find min/max of our dates
            var min = d3.min(data, accessStartDate);
            //var max = d3.max(data, accessEndDate);
            var xScale = d3.scale.linear()
                .domain([min,2020])
                .range([125, canvas_width-100]);
            // This creates an axis. You can see that it assign's the scale we made up above
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .tickFormat(d3.format("d"));  //remove comma
                
            // Create svg container
            var svg = d3.select("#svg-canvas")
                    .append("svg")
                    .attr("width", canvas_width)
                    .attr("height", canvas_height);
            // Bottom Axis
            var btmAxis = svg.append("g")
                .attr("transform", "translate(0,"+(canvas_height - 25)+")")
                .attr("class", "axis")
                .call(xAxis);
            // Top Axis
            var topAxis = svg.append("g")
                .attr("transform", "translate(0,0)")
                .attr("class", "axis")
                .call(xAxis);
            // Lines
            var line = svg.append("g")
                .selectAll("line")
                    .data(xScale.ticks(10))
              .enter().append("line")
                .attr("x1", xScale)
                .attr("x2", xScale)
                .attr("y1", 30)
                .attr("y2", canvas_height-50)
                .style("stroke", "#ccc");
            $.each(data, function(index, value){
                //var start_pixels = xScale(value['starts'])
                //var bar_width = xScale(value['ends']) - start_pixels
                 var d = new Date(value['starts'])
                 var f = new Date(value['ends'])
                 //42
                 var debuta = d.getMinutes()
                 var finita = f.getMinutes()
                 var durer = finita - debuta 
                // var start_pixels = (value['starts']).getTime()
                 var start_pixels = debuta + 50
                 var n = (f - d)/60000
                 //var bar_width = xScale((value['ends']).getTime()) - start_pixels
                 var bar_width = n * 1000 / 60
                //alert(start_pixels);
                
                var new_bar = '<div class="bar-wrapper  '+value['party']+' '+value['chief']+' '+value['recess']+' " data-name="'+value['client-hostname']+'" data-start_date="'+value['start']+'" data-end_date="'+value['end']+'" data-years="'+durer+'" data-party="'+value['hardware ethernet']+'">\
                    <div class="bar" style="margin-left:'+start_pixels+'px;width:'+bar_width+'px;">\
                        <div class="bar-name">'+value['client-hostname']+'</div>\
                    </div>\
                </div>'
                $('#gantt-bar-container').append(new_bar)
            })
                alert(bar_width);
            $container = $('#gantt-bar-container');
            $container.isotope({
              itemSelector : '.bar-wrapper',
              getSortData : {
                  name : function ( $elem ) {
                      return $elem.attr('data-name')
                  },
                  start_date : function ( $elem ) {
                      return parseInt($elem.attr('data-start_date'))
                  },
                  end_date : function ( $elem ) {
                      return parseInt($elem.attr('data-end_date'))
                  },
                  years: function ( $elem ) {
                      return parseInt($elem.attr('data-years'))
                  }
              }
            });
            var years_extent = d3.extent(data, function(d){return Number(d['years'])})
            // Make the scale
            yearsScale = d3.scale.linear()
                .domain(years_extent)
                .range([0,5]);
        });
        // Sorting buttons
        // So let's make a simple sort_ascending boolean variable and set it to true
        var sort_ascending = true;
        $('#sorter li a').click(function(){
            // Set it to what it ain't
            sort_ascending = !sort_ascending
            var sorter_selector = $(this).attr('data-sorter');
          
            // When we update the isotope layout, it has a property called sortAscending that will then get our value
            $('#gantt-bar-container').isotope({ sortBy : sorter_selector, sortAscending: sort_ascending });
        });
        // Filter buttons
        $('#filter li a').click(function(){
          var filter_selector = $(this).attr('data-filter');
          $('#gantt-bar-container').isotope({ filter: filter_selector });
          return false;
        });
        var GREENS = ["#B2D0B2","#80B280","#66A266","#338333","#006400","#003C00"]
        var PCOLORS = ["pink","purple","blue","black","red"]
        // Color buttons
        $('#color li a').click(function(){
          var color_selector = $(this).attr('data-color');
          // Get all the bars
          var $bar_wrappers = $('.bar-wrapper');
 if (color_selector == 'party1'){
            $.each($bar_wrappers, function(index, bar_wrapper){
                // Find each div's data years
                var this_years = $(bar_wrapper).attr('data-party')
                // Run this through our color scale
               // var new_color_at_index = Math.floor(yearsScale(this_years))
                $(bar_wrapper).find('.bar').css({'background-color':PCOLORS[this_years]})
            });
          }
else if  (color_selector == 'years'){
            $.each($bar_wrappers, function(index, bar_wrapper){
                // Find each div's data years
                var this_years = $(bar_wrapper).attr('data-years')
                // Run this through our color scale
                var new_color_at_index = Math.floor(yearsScale(this_years))
                $(bar_wrapper).find('.bar').css({'background-color':GREENS[new_color_at_index]})
});
          }
          else{
            $.each($bar_wrappers, function(index, bar_wrapper){
                // Reset to the default background color
                $(bar_wrapper).find('.bar').css({'background-color':''})
            });
          }
        });
    }).call(this)
    

/** affiche de graph a partire de dhcp api a modifier plus tard  **/
G = {
  "192.168.16.1": ["1", "3"],
  "1": ["3", "4"],
  "2": [],
  "3": ["2"],
  "4": ["3"],
  "5": ["0"]
}
//console.log(G);
var editor = ace.edit("graph-input");

editor.renderer.setShowGutter(false);
editor.getSession().setMode("ace/mode/javascript");


setTextAreaDefault();

function prettyPrintRefresh() {
  var ugly = editor.getValue();
  var obj;
  try {
    obj = JSON.parse(ugly);
  } catch (err) {
    setErrorMessage(err);
  }
  var pretty = js_beautify(JSON.stringify(obj, undefined));
  editor.setValue(pretty);
}

function setErrorMessage(msg) {
  message = '<div class="alert alert-danger alert-error">'
            + '<a href="#" class="close" data-dismiss="alert">&times;</a>'
            + msg
          + '</div>'
  $('#leftcolumn').append(message);
}

function clearErrorMsg() {
  $('.alert').remove();
}

function setTextAreaDefault() {
  var pretty = js_beautify(JSON.stringify(G, undefined));
  editor.setValue(pretty, 1);
  $('#')
}

function nodeExists(nodes, val) {
  var exists = false;
  if (nodes[val.toString()]) {
    exists = true;
  }
  return exists;
}

function createNode(id) {
  var node = {}
  node[id.toString()] = {
    "name": id.toString()
  }
  return node;
}

function createData(G) {
  var nodes = {};
  var edges = [];

  $.each(G, function(fromVertex, connectedVertices) {
    if (!nodeExists(nodes, fromVertex)) {
      nodes[fromVertex.toString()] = {
        "name": fromVertex.toString()
      }
    }

    connectedVertices.forEach(function(toVertex) {
      if (!nodeExists(nodes, toVertex)) {
        nodes[toVertex.toString()] = {
          "name": toVertex.toString()
        }
      }

      edge = {
        "source": fromVertex.toString(),
        "target": toVertex.toString(),
        "type": "licensing",
      }

      edges.push(edge);
    });
  });


  data = {
    "nodes": nodes,
    "edges": edges
  }
  return data;
}

data = createData(G);
update(data.edges, data.nodes);


function submit() {
  val = editor.getValue();
  var graph;
  try {
    graph = JSON.parse(val);
    data = createData(graph);
    update(data.edges, data.nodes);
    clearErrorMsg();
  } catch (err) {
    setErrorMessage(err);
  }
}