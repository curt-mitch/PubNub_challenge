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
    var geoLocationValues = [];
    var geoSourceValue = [];
    var channelVol = channelData.channels_msg_vol;
    var countryVol = channelData.countries_msg_vol;
    var geoLocations = channelData.geo_map;
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
    for(var i in geoLocations) {
      if(!(geoLocations[i].geos[0])) {
        geoSourceValue.push({
          location: [geoLocations[i].lat, geoLocations[i].lng]
        });
      } else {
        geoLocationValues.push({
          channel: geoLocations[i].channel,
          location: geoLocations[i].geos[0]
        });
      }
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

    var mapWidth = 960;
    var mapHeight = 480;

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

    // map for channel geolocations
    var projection = d3.geo.equirectangular()
      .scale(153)
      .translate([mapWidth / 2, mapHeight / 2])
      .precision(.1);

    var path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule();

    var channelMap = d3.select('#channel-map')
      .append('svg')
      .attr('width', mapWidth)
      .attr('height', mapHeight);

    channelMap.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path);

    d3.json('/data/mapData.json', function(error, world) {
      channelMap.insert('path', '.graticule')
        .datum(topojson.feature(world, world.objects.land))
        .attr('class', 'land')
        .attr('d', path);

      channelMap.insert('path', '.graticule')
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr('class', 'boundary')
        .attr('d', path);
    });

    function mapSources(div, data, color) {
      channelMap.selectAll(div)
      .data(data)
      .enter().append('circle', '.map-pin')
      .attr('r', 3)
      .attr('fill', color)
      .attr('transform', function(d) {
        return "translate(" + projection([
          d.location[1],
          d.location[0]
        ]) + ')'
      });
    }

    var legendLabels = ['subscribers', 'publisher'];
    var legendColors = ['lightgreen', 'red'];

    mapSources('.map-pin', geoLocationValues, 'lightgreen');
    mapSources('.source-pin', geoSourceValue, 'red');

    var mapLegend = channelMap.append('g')
      .attr('transform', 'translate(' + (mapHeight - 50) + ',' + (mapHeight - 20) + ')')
      .selectAll('g')
      .data(['subscriber','publisher'])
      .enter().append('g');

    mapLegend.append('circle')
      .attr('cy', function(d, i) { return (i * 20) - 405; })
      .attr('cx', 550)
      .attr('r', 4)
      .style('fill', function(d, i) { return legendColors[i]; });

    mapLegend.append('text')
      .attr('x', 565)
      .attr('y', function(d, i) { return (i * 20) - 400; })
      .text(function(d, i) { return legendLabels[i]; })
      .style('font-size', '16px')

  };

});