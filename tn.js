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
var congressData
Promise.all([
			d3.csv("FLIPPED_numberedCongressionalDistrict.csv")])
 .then(function(data){
	// console.log(data)
	 congressData=formatCongressData(data[0])
	 
	 
	   var map = drawMap(data[0])
})
//click layer
//show a layer
//
function formatCongressData(data){
	var formatted = {}
	for(var i in data){
		if(data[i]["Label (Grouping)"]!=undefined){
			var geoid = data[i]["Label (Grouping)"]
			
			formatted[geoid]=data[i]
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
		if(layerName.indexOf("copy")>-1){
			searchLayers.push(layerName)
		}
	}
	//console.log(searchLayers)
	
	var features = map.queryRenderedFeatures(pointOnScreen, {
	  	layers: searchLayers
	  })
  		//console.log(features)
	  
	  displayString = ""
		 
	  for(var f in features){
		  if (features[f].layer.id!= "G4000"){
		  	var layer = features[f].layer.id.replace(" copy"," copy 1")
				  map.setLayoutProperty(
				  layer,
				  'visibility',
				  'visible'
				  );

			  var geoid = features[f].properties["geo_id"]
			  map.setFilter(layer,["==","geo_id",geoid])
			  
			  console.log(features[f].properties)
				
			  displayString+=features[f].layer.id+": "+geoid+features[f].properties.name+"<br>"
		  }
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

function drawMap(newInter){
	
	
//	console.log(dict)
//var maxBounds = [[-74.3, 40.5],[-73.5, 41]]
    mapboxgl.accessToken = "pk.eyJ1Ijoiamlhei11c2FmYWN0cyIsImEiOiJjbDNrOXUxNmoxamNmM2ltcmdhemQwNWJiIn0.QVFg3eeO5XBtNc5WRDHEYg"
    map = new mapboxgl.Map({
		container: 'map',
		style:"mapbox://styles/jiaz-usafacts/cl5vfpk4l001y14o4ab68qde5",// ,//newest
		zoom: 9,
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
	  console.log(map.getStyle().layers)
		  
		  clicked=true
		  map.on('click', (e) => {
			 center = [e.lngLat.lng,e.lngLat.lat]
			  map.flyTo({
				  center: center//,
				  //zoom:8
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

