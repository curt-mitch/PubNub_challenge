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
    var countryVolValues = [];
    var channelVol = channelData.channels_msg_vol;
    var countryVol = channelData.countries_msg_vol;
    for(var key in channelVol) {
      channelVolValues.push({
        channel: key,
        volume: channelVol[key]
      });
    }
    for(var key in countryVol) {
      countryVolValues.push({
        country: key,
        volume: countryVol[key]
      });
    }

    // initialize Chosen multiple-select menu
    $('#graph-select').chosen({
      width: '25%'
    });

    $('#graph-select').change(function(evt, params){
      $(params.selected).show();
      $(params.deselected).hide();
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
    var countryObjLength = countryVolValues.length

    // chart for volume per channel
    var channel_chart = d3.select('#channel-chart')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    channel_chart.selectAll('rect')
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

    channel_chart.selectAll('text')
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
          return height - (d.volume * 10) - 5;
        })
        .attr('font-size', '10px');

    // chart for volume per country
    var country_chart = d3.select('#country-chart')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    country_chart.selectAll('rect')
        .data(countryVolValues)
        .enter()
        .append('rect')
        .attr('x', function(d, i) {
              return i * (width / countryObjLength);
        })
        .attr('y', function(d) {
              return height - (d.volume);
        })
        .attr('width', width / countryObjLength - barPadding)
        .attr('height', function(d) {
              return d.volume * 10;
        })
        .attr('fill', function(d) {
              return "rgb(0, 0, " + (d.volume * 100) + ")";
        });

    country_chart.selectAll('text')
        .data(countryVolValues)
        .enter()
        .append('text')
        .text(function(d) {
          return d.country;
        })
        .attr('x', function(d, i) {
          return i * (width / countryObjLength) + 5;
        })
        .attr('y', function(d) {
          return height - d.volume - 5;
        })
        .attr('font-size', '10px');

  };

});