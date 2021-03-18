<?php
	require_once('../../inc/commun.php');
	redirigeAdmin();

	$resultat = $mysqli->query('SELECT * FROM entreprise');
	$entreprises = $resultat->fetch_all(MYSQLI_ASSOC);

	require_once('../../inc/haut.inc.php');
?>
<div class="mohad">

 <title>D3 + Isotope Gantt chart</title>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="libs/d3.v3.min.js"></script>
    <script src="libs/jquery.isotope.min.js"></script>

    <style>
body {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light","Helvetica Neue", Helvetica,sans-serif;
    font-size: 16px;
    color: #696969;
    padding: 3px;
}
p {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light","Helvetica Neue", Helvetica,sans-serif;
    font-size: 14px;
    color: #696969;
    padding: 3px;
}
        .axis path,
        .axis line {
            fill: none;
            stroke: none;
            shape-rendering: crispEdges;
        }
        .axis text {
            font-family: sans-serif;
            font-size: 11px;
        }
        .bar{
            background-color:#8A2BE2;
            height:10px;
            margin-bottom:8px;
        }
        .bar-wrapper{
            width:100%;
        }
        .bar-wrapper:hover .bar{
            opacity:.55;
            -moz-opacity:.55;
            -webkit-opacity:.55;
        }
        .bar-wrapper:hover .bar-name{
            text-decoration: underline;
        }
        .bar-name{
            font-size:11px;
            font-family: "HelveticaNeue-Light", "Helvetica Neue Light","Helvetica Neue", Helvetica,sans-serif;
            font-weight: 500;
            position: absolute;
            left: 0;
            padding-top:4px;
        }
        .bar-name:hover{
            cursor:default;
        }
        
        #button-container{
            height:100px;
            font-family: "HelveticaNeue-Light", "Helvetica Neue Light","Helvetica Neue", Helvetica,sans-serif;
            font-weight: 300;
            text-align: left;
            padding-bottom: 10px; 
        }
        h4{
    margin: 0;
    padding: 0;
        }
        
        .button-block li a{
            font-size:14px;
            color:purple;
            text-decoration: none;
        }
        .button-block li a:hover{
            text-decoration: underline;
            background: #ffffff;
        }
        .button-block{
            float:left;
            margin-top:20px;
      
        }
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
     padding-right: 60px; 
}
#sorter li { list-style-type: none; display: inline; padding-right: 20px; }
#color li { list-style-type: none; display: inline; padding-right: 20px; }
#filter li { list-style-type: none; display: inline; padding-right: 20px; }
        /* tooltip */
        /**** Isotope Filtering ****/
        .isotope-item {
          z-index: 2;
        }
        .isotope-hidden.isotope-item {
          pointer-events: none;
          z-index: 1;
        }
        /**** Isotope CSS3 transitions ****/
        .isotope,
        .isotope .isotope-item {
          -webkit-transition-duration: 0.4s;
             -moz-transition-duration: 0.4s;
              -ms-transition-duration: 0.4s;
               -o-transition-duration: 0.4s;
                  transition-duration: 0.4s;
        }
        .isotope {
          -webkit-transition-property: height, width;
             -moz-transition-property: height, width;
              -ms-transition-property: height, width;
               -o-transition-property: height, width;
                  transition-property: height, width;
        }
        .isotope .isotope-item {
          -webkit-transition-property: -webkit-transform, opacity;
             -moz-transition-property:    -moz-transform, opacity;
              -ms-transition-property:     -ms-transform, opacity;
               -o-transition-property:      -o-transform, opacity;
                  transition-property:         transform, opacity;
        }
        /**** disabling Isotope CSS3 transitions ****/
        .isotope.no-transition,
        .isotope.no-transition .isotope-item,
        .isotope .isotope-item.no-transition {
          -webkit-transition-duration: 0s;
             -moz-transition-duration: 0s;
              -ms-transition-duration: 0s;
               -o-transition-duration: 0s;
                  transition-duration: 0s;
        }
    </style>

</div>
<h1>DHCP Information</h1>

<?php
	if (isset($_SESSION['entreprise_message'])) {
			echo'<div class="alert alert-success alert-dismissable fade in">'
			.'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
			.'<strong>Réussi!</strong> ' . $_SESSION['entreprise_message'] .'!'
			.'</div>';
		unset($_SESSION['entreprise_message']);
	}
?>
<div class="row">
	<h4 class="col-lg-2 col-md-2 col-sm-2"><a href="<?php echo URL_BASE;?>/index.php"><span class="glyphicon glyphicon-backward"></span> Retour</a></h4>
	
</div>
<div class="row">
    <div class="panel-heading">  
<h4>Informations DHCP. Il y a <strong class="c"><span id="devices">0</span> appareils</strong> connectes maintenant.</h4>
</div>
    <div classe="groupe-element">
        <h3>Entrer votre Url Api </h3>
     
          <ul class="list-inline">
            <input class="form-control" type="url" value="http://localhost:4000/api/noeuds" id="urlapi">
            <button  onclick="urlApiFunction()" class="btn btn-info btn-md"><i class="fa fa-circle-o-notch fa-spin"></i> Telechargement</button>
          </ul>
        
    </div>
    
	<table class="table table-striped table-hover">
		<thead>
            <tr>
                <th>IP</th>
                <th>Nom d'hote</th>
                <th>Adresse Mac </th>
            </tr>
                </thead>
                <tbody id="clients">
            </tbody>
	</table>
</div>
<div class="row">

<h1>generale graphique</h1>

<br>


    <div id="button-container">
        <div class="button-block">  
            <ul id="sorter">
                <li><a href="#" data-sorter="name">Nom</a></li>
                <li><a href="#" data-sorter="start_date">date debut</a></li>
                <li><a href="#" data-sorter="end_date">date fin</a></li>
                <li><a href="#" data-sorter="years">annee</a></li>
            </ul>
        </div>
    </div>
    <div id="chart-canvas" style="width:100%;position:relative;float:left;">
        <div id="svg-canvas" style="position:absolute;top:0;bottom:0;left:0;right:0;"></div>
        <div id="gantt-bar-container" style="position:absolute;top:0;bottom:0;left:0;right:0;padding-top:30px;"></div>

    </div>
   
</div>
<script src="dhcp-info.js"></script>

<?php
	require_once('../../inc/bas.inc.php');
?>



