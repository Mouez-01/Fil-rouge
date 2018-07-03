G = {
  "0": ["1", "3"],
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
/** envoier de code Json a L'API **/

            $(function(){				
                $('#select_link').click(function(e){
                    e.preventDefault();    
                    var url = "http://localhost:4000/api/noeuds";

                      //  var data = {"0":["1","3"],"1":["3","0"],"2":["0","4"],"3":["2"],"4":["1"]};
                        //data.firstname = "Mouez";
                        //data.lastname  = "ahlan";
                        var ugly = editor.getValue();
                        var objj = JSON.parse(ugly);
                        var json = JSON.stringify(objj);

                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", url, true);
                        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
                        xhr.onload = function () {
                            var users = JSON.parse(xhr.responseText);
                           /* if (xhr.readyState == 4 && xhr.status == "201") {
                                console.table(users);
                            } else {
                                console.error("users");
                            }*/
                        }
                        xhr.send(json);
                     console.log(json);
                    
					
                });				
            });

/** teste de telechargement de fichier **/


document.getElementById('import').onclick = function loadfiles()
{
    var imageFiles = document.getElementById("selectFiles"),
        
    filesLength = imageFiles.files.length;
    for (var i = 0; i < filesLength; i++) {
      document.write(imageFiles.files[i].name);
    }
};


/** test lecture de fichier **/


 function readBlob(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        //document.getElementById('graph-input').textContent = evt.target.result;
        
            myJSON = evt.target.result;
      //  ------------------------------------------------------------------------------------------------
 var datas = JSON.parse( evt.target.result );
          
          var pretty = js_beautify(JSON.stringify(datas, undefined));
         editor.setValue(pretty, 1);
          document.getElementById('graph-input').textContent = pretty;
         // val = editor.getValue();
          alert(G);
          
             
          
          
          
        document.getElementById('byte_range').textContent = 
            ['Read bytes: ', start + 1, ' - ', stop + 1,
             ' of ', file.size, ' byte file'].join('');
      }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  }
  
  document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
    if (evt.target.tagName.toLowerCase() == 'button') {
      var startByte = evt.target.getAttribute('data-startbyte');
      var endByte = evt.target.getAttribute('data-endbyte');
      readBlob(startByte, endByte);
    }
  }, false);

//lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
var dropZoneId = "drop-zone";
  var buttonId = "clickHere";
  var mouseOverClass = "mouse-over";
var dropZone = $("#" + dropZoneId);
 var inputFile = dropZone.find("input");
 var finalFiles = {};
$(function() {
  

  
  var ooleft = dropZone.offset().left;
  var ooright = dropZone.outerWidth() + ooleft;
  var ootop = dropZone.offset().top;
  var oobottom = dropZone.outerHeight() + ootop;
 
  document.getElementById(dropZoneId).addEventListener("dragover", function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.addClass(mouseOverClass);
    var x = e.pageX;
    var y = e.pageY;

    if (!(x < ooleft || x > ooright || y < ootop || y > oobottom)) {
      inputFile.offset({
        top: y - 15,
        left: x - 100
      });
    } else {
      inputFile.offset({
        top: -400,
        left: -400
      });
    }

  }, true);

  if (buttonId != "") {
    var clickZone = $("#" + buttonId);

    var oleft = clickZone.offset().left;
    var oright = clickZone.outerWidth() + oleft;
    var otop = clickZone.offset().top;
    var obottom = clickZone.outerHeight() + otop;

    $("#" + buttonId).mousemove(function(e) {
      var x = e.pageX;
      var y = e.pageY;
      if (!(x < oleft || x > oright || y < otop || y > obottom)) {
        inputFile.offset({
          top: y - 15,
          left: x - 160
        });
      } else {
        inputFile.offset({
          top: -400,
          left: -400
        });
      }
    });
  }

  document.getElementById(dropZoneId).addEventListener("drop", function(e) {
    $("#" + dropZoneId).removeClass(mouseOverClass);
  }, true);


  inputFile.on('change', function(e) {
    finalFiles = {};
    $('#filename').html("");
    var fileNum = this.files.length,
      initial = 0,
      counter = 0;

    $.each(this.files,function(idx,elm){
       finalFiles[idx]=elm;
    });

    for (initial; initial < fileNum; initial++) {
      counter = counter + 1;
      $('#filename').append('<div id="file_'+ initial +'"><span class="fa-stack fa-lg"><i class="fa fa-file fa-stack-1x "></i><strong class="fa-stack-1x" style="color:#FFF; font-size:12px; margin-top:2px;">' + counter + '</strong></span> ' + this.files[initial].name + '&nbsp;&nbsp;<span class="fa fa-times-circle fa-lg closeBtn" onclick="removeLine(this)" title="remove"></span></div>');
    }
  });



})

function removeLine(obj)
{
  inputFile.val('');
  var jqObj = $(obj);
  var container = jqObj.closest('div');
  var index = container.attr("id").split('_')[1];
  container.remove(); 

  delete finalFiles[index];
  //console.log(finalFiles);
    
   
    }

$.each(this.files,function(idx,elm){
           finalFiles[idx]=elm;
        });