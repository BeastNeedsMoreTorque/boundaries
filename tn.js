//TODO
//XXXexport and upload new layers
//XXXconnect new data 
//XXXfix upper/lower case issues

//Change fire division to fire company
//add hover popup on map- query filtered visible layers - add popup to show district numbers for each
//fix municiple court same code in multiple boroughs
//get second clicks working
//redo text
//get colors working - in groups or sections?
//do a show all option? - offset lines?


//Congressional District (at Large) (116th Congress), Montana!!Total!!Estimate	831,760
//Congressional District (at Large) (116th Congress), Delaware!!Total!!Estimate	725,178
//Congressional District 1 (116th Congress), Idaho!!Total!!Estimate	682,493
//Congressional District 11 (116th Congress), Florida!!Total!!Estimate	669,669


//Congressional District 1 (116th Congress), Rhode Island!!Total!!Estimate	391,053
//Congressional District 21 (116th Congress), California!!Total!!Estimate	376,921
//Congressional District 33 (116th Congress), Texas!!Total!!Estimate	354,913
//Congressional District 40 (116th Congress), California!!Total!!Estimate	334,291

var map;
var housingCount
var populationCount
var positionsData
Promise.all([
			d3.json("censusData_by_mtfcc/H1_001N.json"),
			d3.json("censusData_by_mtfcc/P1_001N.json"),
d3.csv("races2b.csv")])
 .then(function(data){
	// console.log(data)
	// congressData=formatCongressData(data[0])
	 
	 console.log(data)
	 housingCount = data[0]
	 populationCount = data[1]
	 positionsData = formatPositions(data[2])
	 
	   var map = drawMap()
})
//click layer
//show a layer
//
function formatPositions(data){
	var formatted = {}
	for(var i in data){
		var geoid = data[i]["geoId"]
		var mtfcc = data[i]["mtfcc"]
		if(mtfcc!=undefined){
			if(geoid.slice(0,2)=="47"){
				//console.log(geoid, geoid.slice(0,2),mtfcc, data[i].name)
				console.log("TN")
			}
			
		}
		
		if(Object.keys(formatted).indexOf(mtfcc)==-1){
			formatted[mtfcc]={}
			formatted[mtfcc][geoid]=data[i]
		}else{
			formatted[mtfcc][geoid]=data[i]
		}
	}
	return formatted
}

var marker = null;

var clicked = false
var resulted = false
var marker = new mapboxgl.Marker({
			color:"#fa6614"
		})
		
		
		var layerColors = {
G4000: "#e62790",
G5220: "#00347B",
G5210: "#249edc",
G5200: "#6929c4",
G5410: "#20659d",
G5400: "#cf77ad",
G4110: "#851c6a",
G5420: "#a56eff",
G4210: "#006600",
G4040: "#CC6A19",
G4020: "#E5BD3F",
X0072:'red', 
X0001:"magenta", X0014:"green", X0005:"gold", X0029:"gold"
		}
		
		var layerNames = {
G4000: "State or Equivalent Feature Tabulation Area",
G5220: "State Legislative District (Lower Chamber) Tabulation Area",
G5210: "State Legislative District (Upper Chamber)",
G5200: "Congressional District",
G5410: "Secondary School District",
G5400: "Elementary School District",
G4110: "Incorporated Place",
G5420: "Unified School District",
G4210: "Census Designated Place",
G4040: "County Subdivision",
G4020: "County or Equivalent Feature"
			
		}
function setCenter(latLng){
//	 console.log(congressData)
	console.log("call set center")
	
//	console.log(map.getStyle().layers)
	marker.setLngLat([latLng[0],latLng[1]])
	.addTo(map);
	
	  var pointOnScreen = map.project(latLng)
	
	var layers = map.getStyle().layers
	var searchLayers = []
	for(var l in layers){
		var layerName = layers[l].id
		if(layerName.indexOf("copy 1")==-1){
			searchLayers.push(layerName)
		}
	}
	console.log(searchLayers)
	
	var features = map.queryRenderedFeatures(pointOnScreen, {
	  	layers: searchLayers
	  })
  		//console.log(features)
	  
	  var uniqueIds = []
	  displayString = ""
		 console.log(features)
	  for(var f in features){
		  if (features[f].layer.id.indexOf("G4000")==-1){
		  	var layer = features[f].layer.id.replace(" copy"," copy 1")
				  map.setLayoutProperty(
				  layer,
				  'visibility',
				  'visible'
				  );

			  var geoid = features[f].properties["geo_id"]
			
			console.log(features[f].properties)
				  if(uniqueIds.indexOf(geoid)==-1){
				  	uniqueIds.push(geoid)
				  console.log(layer.replace(" copy 1",""))
				  
	 				 map.setPaintProperty(layer, 'fill-color', layerColors[layer.replace(" copy 1","")]);
					 map.setPaintProperty(layer, 'fill-opacity', .1);
				 
			  map.setFilter(layer,["==","geo_id",geoid])
				  var mtfccId = features[f].properties["id"]
			  //console.log(features[f].properties)
				var layer = features[f].layer.id.replace(" copy","")
				//  console.log(layer, housingCount)
				  
				  var houses = Math.round(housingCount[layer][mtfccId])
				  var population = Math.round(populationCount[layer][mtfccId])
				  
				  //console.log(houses,population)
				  
				  var positions = positionsData[layer.replace(" copy 1","")][geoid]
				  console.log(positions,geoid)
					 if(positions!=undefined){
					 	//console.log(positions)
						displayString+=layer.replace(" copy 1","")+"-"+geoid+" "+"<br>"
						 +positions.level+"<br>"
						 +positions.name+"<br>"
						 +positions.officeHolderName+"<br>"
						 +positions.salary+"<br>"
						 +"years in office: "+positions.totalYearsInOffice+"<br>"
					 }else{
					 	displayString+=layer.replace(" copy 1","")+"-"+geoid+" there is a boundary but no position here<br><br>"
					 }
					 
				  if(Object.keys(layerNames).indexOf(layer)>-1){
				  	layer += " "+layerNames[layer]
				  }
				  var featureName = features[f].properties.name
				  if(featureName==undefined){featureName = ""}
			 // displayString+="<span style=\"color:"+layerColors[layer.replace(" copy 1","")]+"\">mtfcc "+layer+": "+features[f].properties["id"]+featureName+"<br>"+"Population: "+population+"<br> Housing Units: "+houses+"</span><br><br>"
		  }}
	  }
	  
		  
		// map.setFilter(layerName,["==","GEOID",geoid])
	//
	  d3.select("#info").html(displayString)
	//   +"<br>"+"congress: "+congressGeoid+congressDisplay)
	//
	//   if (map.getLayer("blockgroups")) {
	//       map.removeLayer("blockgroups");
	//   }
	//
	//   if (map.getSource("blockgroups")) {
	//       map.removeSource("blockgroups");
	//   }
}

function drawMap(){
	
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jiaz-usafacts/cl5vfpk4l001y14o4ab68qde5",// ,//newest
		zoom: 6,
		preserveDrawingBuffer: true,
		minZoom:7,
		maxZoom:15,// ,
		 // maxBounds: maxBounds,
		center: [-86.330, 35.762]
     });	


	 map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

	  var geocoder = new MapboxGeocoder({
	  				 accessToken:mapboxgl.accessToken,
	  				 mapboxgl: mapboxgl,
	 				 flyTo:false,
	 				 marker:false
	  			 })
	
	 map.addControl(geocoder)
				 
      map.on("load",function(){
	  //console.log(map.getStyle().layers)
		  
		  clicked=true
		  map.on('click', (e) => {
			 center = [e.lngLat.lng,e.lngLat.lat]
			  map.flyTo({
				  center: center,
				  zoom:8
			  });
			  
			  if(clicked==true){
				  clicked = false
				  map.on("moveend",function(){
					  setCenter(center)
				  })
			  }
		});
	
	  		geocoder.on('result', function(result) {
					resulted = true
	  			if(result!=null){
	 				center = result.result.center
					//console.log(center)
					map.flyTo({center:center, zoom:8})
					if(resulted==true){
					  	 resulted=false
					  	 map.on("moveend",function(){
						  setCenter(center)
					  })	
				  }
	  			}
	  		});

		 })
}


function filterOnResult(map,features){
	
	// for(var i in features){
	// 	var layerName = features[i].layer.id.replace("_hover","")
	// 	 var idKey = layerUniqueIds[layerName]
	// 	console.log(layerName)
	// 	if(layerName=="borough"){
	// 		console.log(features[i])
	// 		currentBorough = features[i]["properties"][idKey]
	// 		break
	//
	// 	}
	//
	// }
	// 	console.log(currentBorough)
	// var doubleFilterLayers = ["neighborhood","municipalCourt"]
	//
	for(var f in features){
			//console.log(features[f])
			 var layerName = features[f].layer.id.replace("_hover","")  	 	  
			 var idKey = layerUniqueIds[layerName]
			
		
			//console.log(idKey)
			 var gid = features[f]["properties"][idKey]
			//console.log([idKey,gid])
 			map.setFilter(layerName,["==",idKey,gid])
 			map.setFilter(layerName+"_outline",["==",idKey,gid])
   		 	map.setPaintProperty(layerName+"_outline",'line-opacity',onOpacity);
			map.setLayoutProperty(layerName,'visibility',"visible");//
			map.setLayoutProperty(layerName+"_outline",'visibility',"visible");//
		
			
			
		 

		 // map.setPaintProperty(layerName,'fill-color',colors[i]);
		 map.setPaintProperty(layerName,'fill-opacity',offOpacity);
			//map.setFilter(layerName+"_hover",["!=",idKey,gid])
		}
}

