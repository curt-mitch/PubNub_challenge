// Script for importing PubNub JSON and producing data visualizations
'use strict';

var channelData = {};

$(document).ready(function() {

  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/data/sampleData.json',
    success: handleData,
    error: ajaxError
  });

  function ajaxError() {
    console.log('failed to fetch JSON');
  };

  function handleData(data) {
    channelData = data;
    parseData(channelData);
  };

  function parseData(channelData) {
    var channelVolValues = [];
    var channelVol = channelData.channels_msg_vol;
    var countryVol = channelData.countries_msg_vol;
    for(var key in channelVol) {
      channelVolValues.push({
        channel: key,
        volume: channelVol[key]
      });
    }

    console.log('channelVol',channelVol);
    console.log('channelVolValues', channelVolValues);

  // initialize Chosen multiple-select menu
  $('#graph-select').chosen({
    width: '25%'
  });

  // declare variables for d3 graphs
  var margin = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 40
  };
  var width = 600 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  var barPadding = 1;
  var channelObjLength = channelVolValues.length

  var chart = d3.select('.chart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

  chart.selectAll('rect')
      .data(channelVolValues)
      .enter()
      .append('rect')
      .attr('x', function(d, i) {
            return i * (width / channelObjLength);
      })
      .attr('y', function(d) {
            return height - (d.volume * 10);
      })
      .attr('width', width / channelObjLength - barPadding)
      .attr('height', function(d) {
            return d.volume * 10;
      })
      .attr('fill', function(d) {
            return "rgb(0, 0, " + (d.volume * 50) + ")";
      });

  chart.selectAll('text')
      .data(channelVolValues)
      .enter()
      .append('text')
      .text(function(d) {
        return d.channel;
      })
      .attr('x', function(d, i) {
        return i * (width / channelObjLength) + 5;
      })
      .attr('y', function(d) {
        return height - (d.volume * 10) + 15;
      })
      .attr('font-size', '10px')
      .attr('fill', 'white');

  };

});