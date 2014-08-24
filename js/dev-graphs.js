// Script for importing PubNub JSON and producing data visualizations
'use strict'

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
  console.log('sampleData',data);
};
