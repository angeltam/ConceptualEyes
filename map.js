var width = window.innerWidth,
    height = window.innerHeight;

var force = d3.layout.force()
    .charge(-1200)
    .linkDistance(200)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var graph =
    {
      "nodes":[
        {"name":"Firebase"},
        {"name":"D3"},
        {"name":"Bootstrap"},
        {"name":"App View"},
        {"name":"HTML Form"},
        {"name":"Concept Map"},
        {"name":"New Concept"},
        {"name":"Flask"},
        {"name":"Heroku"}

      ],
      "links":[
        {"source":"Flask", "target":"Heroku"},
        {"source":"Bootstrap", "target":"App View"},
        {"source":"D3", "target":"Concept Map"},
        {"source":"Firebase", "target":"New Concept"},
        {"source":"New Concept", "target":"D3"},
        {"source":"Flask", "target":"App View"},
        {"source":"HTML Form", "target":"Firebase"},
        {"source":"Bootstrap", "target":"HTML Form"}
      ]
    };

var edges = [];
  graph.links.forEach(function(e) {

    var sourceNode = graph.nodes.filter( function(n) { return n.name === e.source; } )[0];
    var targetNode = graph.nodes.filter( function(n) { return n.name=== e.target; })[0];

    edges.push({source: sourceNode, target: targetNode, relationship: e.relationship});
  });

force
    .nodes(graph.nodes)
    .links(edges)
    .start();

var link = svg.selectAll(".link")
    .data(edges)
    .enter().append("line")
    .attr("stroke","#555")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

node.append("rect")
      .attr("class", "nodebg")
      .attr("x", function(d) { return (d.name).length * -8 - 6; })
      .attr("y", -24)
      .attr("rx", 8)
      .style("fill",function() {
    return "hsl(" + (Math.random() * 5 + 200) + ",100%," + (Math.random() * 17 + 26) + "%)";
    })
      .attr("height", 54)
      .attr("width", function(d) { return (d.name).length * 16 + 32; });

  node.append("text")
      .attr("class", "nodetxt")
      .text(function(d) { return d.name; })
      .attr("text-anchor", "middle")
      .style("font-family","sans-serif")
      .style("font-size", "24px")
      .style("fill","#fff")
      .attr("x", 10)
      .attr("y", 10);

force.on("tick", function() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});


$(document).ready(function () {
    console.log("enter js")
    
    url = "https://conceptualeyes.firebaseio.com/"
    addBtnId = "add_rel_btn"

    //connect to the db
    var eyesDb = new Firebase("https://conceptualeyes.firebaseio.com/");
    
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


    //get back the whole map object
    eyesDb.child("map1").on("value", function (snapshot) {
        //get data
        var newMap = snapshot.val();
        console.log(JSON.stringify(newMap));
 
      
        //display newly added relationship as html
//        var newRelStr = $("<p>").text(newRel.key1+" "+newRel.rel+" "+ newRel.key2);
//        $("#buffer").append(newRelStr);
    });
    
 });   