/* eslint-disable no-restricted-globals */
import Addition from "../Addition";
import * as d3 from "d3";
import data from "../miserables.json";
self.onmessage = (ev) => {
  const recieveData = ev.data.message;
  let simulation = d3
    .forceSimulation(data.nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(data.links))
    .force("center", d3.forceCenter())
    .on("tick", () => {
      self.postMessage(data);
    });

  console.log(recieveData);
  const result = Addition(3);
  //   self.postMessage({
  //     result: result,
  //   });
};
