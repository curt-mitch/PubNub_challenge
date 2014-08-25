// Script for importing PubNub JSON and producing data visualizations
'use strict'

var channelData = {};

$(document).ready(function() {

  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/data/sampleData.json',
    success: handleData,
    error: ajaxError
  })

  function ajaxError() {
    console.log('failed to fetch JSON');
  };

  function handleData(data) {
    channelData = data;
    console.log('channelData', channelData);
  };

  // initialize Chosen multiple-select menu
  $('#graph-select').chosen({
    width: "25%"
  });

});