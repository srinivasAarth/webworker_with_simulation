import React from "react";
import * as d3 from "d3";
import data from "../Components/miserables.json";
const NodeGraph = () => {
  const nodeGraphRef = React.useRef(null);
  React.useEffect(() => {
    var width = 500,
      height = 500;

    var color = "0x65835af";
    var svg = d3
      .select(nodeGraphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    // Pass data to web-worker
    const worker = new Worker(
      new URL("../Components/workerFolder/GraphWorker.js", import.meta.url)
    );
    const hint = "hello world";
    worker.postMessage({
      //   message: hint,
      width: width,
      height: height,
    });
    var node;
    var link;
    let initialized = false;
    worker.onmessage = (msg) => {
      console.log(msg);
      if (!initialized) {
        initialized = true;
        link = svg
          .selectAll(".link")
          .data(msg.data.links)
          .enter()
          .append("line")
          .attr("class", "link")
          .style("stroke-width", 2)
          .style("stroke", "#8ee556");

        node = svg
          .selectAll(".node")
          .data(msg.data.nodes)
          .enter()
          .append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .style("fill", function (d) {
            return color;
          });
      } else {
        link
          .attr("x1", (d, i) => msg.data.links[i].source.x)
          .attr("y1", (d, i) => msg.data.links[i].source.y)
          .attr("x2", (d, i) => msg.data.links[i].target.x)
          .attr("y2", (d, i) => msg.data.links[i].target.y);
        console.log(msg);
        node.attr("transform", function (d, i) {
          return `translate(${msg.data.nodes[i].x}, ${msg.data.nodes[i].y})`;
        });
        // console.log(node);
      }
    };
    // const ticked = () => {
    //   node.attr("transform", function (d) {
    //     return `translate(${d.x}, ${d.y})`;
    //   });
    //   link

    //     .attr("x1", (d) => d.source.x)
    //     .attr("y1", (d) => d.source.y)
    //     .attr("x2", (d) => d.target.x)
    //     .attr("y2", (d) => d.target.y);
    // };

    // let simulation = d3
    //   .forceSimulation(data.nodes)
    //   .force("charge", d3.forceManyBody())
    //   .force("link", d3.forceLink(data.links))
    //   .force("center", d3.forceCenter())
    //   .on("tick", ticked);

    //create worker and send message to start force graph

    // let link = svg
    //   .selectAll(".link")
    //   .data(data.links)
    //   .enter()
    //   .append("line")
    //   .attr("class", "link")
    //   .style("stroke-width", 2)
    //   .style("stroke", "#8ee556");

    // let node = svg
    //   .selectAll(".node")
    //   .data(data.nodes)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "node")
    //   .attr("r", 5)
    //   .style("fill", function (d) {
    //     return color;
    //   });

    //for all subsequent ticks, update the node/link locations
  });
  return <div ref={nodeGraphRef}></div>;
};

export default NodeGraph;

// importScripts("http://d3js.org/d3.v3.min.js")

// var onmessage = function(msg){
//     //create the force layout in worker thread, does not need dom access
//     var force = d3.layout.force()
//         .charge(-120)
//         .linkDistance(30)
//         .size([msg.data.width, msg.data.height]);

//     d3.json("miserables.json", function(error, graph) {
//         force.nodes(graph.nodes)
//              .links(graph.links)
//              .start();

//         //on each tick send graph to main thread for rendering
//         force.on("tick", function(){
//             postMessage(graph)
//         })
//     });
// }
