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
    console.log('channelData', channelData);
    parseData(channelData);
  };

  function parseData(channelData) {
    var channelVol = channelData.channels_msg_vol;
    var countryVol = channelData.countries_msg_vol;

    // d3.select('.chart')
    //   .selectAll('div')
    //     .data(countryVol)
    //   .enter().append('div')
  };

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
  var height = 300 - margin.top - margin.bottom;

  d3.select('.chart')

});