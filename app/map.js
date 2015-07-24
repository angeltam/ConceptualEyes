var graph =
 {
   "nodes":[
     {"name":"Boy","group":1},
     {"name":"Dog","group":1},
     {"name":"Cat","group":1},
     {"name":"House","group":1}
   ],
   "links":[
     {"source":0, "target":1, "relationship": "loves"},
     {"source":0, "target":2, "relationship": "loves"},
     {"source":0, "target":3, "relationship": "lives in"},
     {"source":1, "target":3, "relationship": "lives in"},
     {"source":2, "target":3, "relationship": "lives in"},
     {"source":1, "target":2, "relationship": "hates"}
   ]
 };


var width = window.innerWidth-50,
    height = window.innerHeight -
             document.getElementById('header').offsetHeight;

var force = d3.layout.force()
   .charge(-1200)
   .linkDistance(200)
   .size([width, height]);

var svg = d3.select("body").append("svg")
   .attr("width", width)
   .attr("height", height)
    .attr("id", "map");


force
   .nodes(graph.nodes)
   .links(graph.links)
   .start();

var link = svg.selectAll(".link")
   .data(graph.links)
   .enter().append("line")
   .attr("class", "link");

var node = svg.selectAll(".node")
   .data(graph.nodes)
		.enter().append("g")
		.attr("class", "node")
		.call(force.drag);

//Captures letter height and width so boxes scale as font-size changes
var map = document.getElementById('map'),
	  letterh = parseFloat(getComputedStyle(map).getPropertyValue('font-size')),
		letterw = letterh * 0.75;

node.append("rect")
  .attr("class", "nodebg")
  .attr("height", letterh * 2.5)
  .attr("width", function(d) { return (d.name).length * letterw + 1.5*letterw; })
  .attr("x", function(d) { return -(d.name).length * letterw/2; })
  .attr("y", -(letterh))
  .attr("rx", 8)
  .attr("fill", function() {
		//Creates random shades of blue for box fill
    return "hsl(" + (Math.random() * 5 + 200) + ",100%," + (Math.random() * 17 + 26) + "%)";
});

node.append("text")
  .attr("class", "nodetxt")
  .text(function(d) { return d.name; })
  .attr("text-anchor", "middle")
  .attr("x", 10)
  .attr("y", 10);

force.on("tick", function() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

var relFromFB = {"key1":"sdf","key2":"nhg","rel":"rty"};


function updateMap (newRel) {
// Does the updating

// Update nodes
function sourceExists(array, newSource) {
   var present = false;
   for (var i=0; i<array.length; i++) {
       if (array[i].name === newSource)
           present = true;
   }
   return present;
}

function targetExists(array, newTarget) {
   var present = false;
   for (var i=0; i<array.length; i++) {
       if (array[i].name === newTarget)
           present = true;
   }
   return present;
}


if (!sourceExists(graph.nodes, newRel.key1)){
   console.log("Source does not exist");
   var newNode = {
       "name": newRel.key1, "group": 1
   };
   graph.nodes.push(newNode);
}

if (!targetExists(graph.nodes, newRel.key2)){
   console.log("Target does not exist");
   var newNode = {
       "name": newRel.key2, "group": 1
   };
   graph.nodes.push(newNode);
}

console.log(graph);


// Update links
var newSourceIndex;
var newTargetIndex;
for (var i=0; i<graph.nodes.length; i++) {
   if (graph.nodes[i].name == newRel.key1) {
       newSourceIndex = i;
   }
   if (graph.nodes[i].name == newRel.key2) {
       newTargetIndex = i;
   }
}

var newLink = {
   "source": newSourceIndex,
   "target": newTargetIndex,
   "relationship": newRel.rel
}

graph.links.push(newLink);

console.log(graph);


// Update rendering

d3.select("svg").remove();
force.stop();

      var forceNew = d3.layout.force()
          .charge(-1200)
          .linkDistance(200)
          .size([width, height]);

      var svgNew = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height)
					.attr("id", "map");

      forceNew
          .nodes(graph.nodes)
          .links(graph.links)
          .start();

      var link = svgNew.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link");

      var node = svgNew.selectAll(".node")
          .data(graph.nodes)
					.enter().append("g")
					.attr("class", "node")
					.call(force.drag);
	
			var map = document.getElementById('map'),
					letterh = parseFloat(getComputedStyle(map).getPropertyValue('font-size')),
					letterw = letterh * 0.75;

			node.append("rect")
				.attr("class", "nodebg")
				.attr("height", letterh * 2.5)
				.attr("width", function(d) { return (d.name).length * letterw + 1.5*letterw; })
				.attr("x", function(d) { return -(d.name).length * letterw/2; })
				.attr("y", -(letterh))
				.attr("rx", 8)
				.attr("fill", function() {
					return "hsl(" + (Math.random() * 5 + 200) + ",100%," + (Math.random() * 17 + 26) + "%)";
			});

			node.append("text")
				.attr("class", "nodetxt")
				.text(function(d) { return d.name; })
				.attr("text-anchor", "middle")
				.attr("x", 10)
				.attr("y", 10);

      forceNew.on("tick", function() {
				link.attr("x1", function(d) { return d.source.x; })
						.attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });

				node.attr("transform", 
									function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });

}

//updateMap(relFromFB);

$(document).ready(function () {
    console.log("enter js")
    
    url = "https://conceptualeyes.firebaseio.com/";
    addBtnId = "add_rel_btn";

    //connect to the db
    var eyesDb = new Firebase("https://conceptualeyes.firebaseio.com/");
    
    //insert new relationship
    $("#add_rel_btn").click(function () {
        console.log("click!")
        //get form values
        var item1 = $("#source_field").val();
        var item2 = $("#target_field").val();
        var rel = $("#relationship_field").val(); // not being used now
        //insert a new relationship node into an existing map node
        eyesDb.child("map1").push({
            key1: item1,
            key2: item2,
            rel: rel
        });
				
    });
    
    //get and display the newly added child
	var latestRel;
	eyesDb.child("map1").limitToLast(1).on("child_added", function (snapshot, prevChildKey) {
			latestRel = snapshot.val();
			console.log(JSON.stringify(latestRel));
			updateMap(latestRel);
    });
	
//	    //get back the whole map
//    eyesDb.child("map1").on("value", function (snapshot) {
//        console.log("callback")
//        var newMap = snapshot.val();
//        console.log("Updated map: " + newMap);
//        console.log(JSON.stringify(newMap));
//				updateMap(newMap);
//    }, function (errorObject) {
//        console.log("Map read failed: " + errorObject.code);
//    });
 
});  