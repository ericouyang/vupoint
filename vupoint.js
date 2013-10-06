Projects = new Meteor.Collection("projects");
Proposals = new Meteor.Collection("proposals");
Analyses = new Meteor.Collection("analyses");
Aggregation = new Meteor.Collection("aggregations");

if (Meteor.isClient) {
  Meteor.Router.add({
    '': 'home',
    '/dashboard': function() {
      Meteor.subscribe("projects");
      return 'dashboard';
    },
    '/project/new': 'project_new',
    '/project/:id': function(id) {
      Template.project_view.project = Projects.findOne({_id: id});
      Template.project_view.proposals = Proposals.find({project_id: id});
      Session.set('projectId', id);
      return 'project_view'
    },
    '/project/:id/proposal/new': function(id) {
      Template.proposal_new.project = Projects.findOne({_id: id});
      Session.set('projectId', id);
      return 'proposal_new';
    },
    '/proposal/:id': function(id) {
      var proposal = Proposals.findOne({_id: id});
      Template.proposal_view.proposal = proposal;
      Template.proposal_view.project = Projects.findOne({_id: proposal.project_id});
      Session.set('proposalId', id);
      return 'proposal_view'
    }
  });

  Meteor.Router.filters({
    'checkLoggedIn': function(page) {
        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.user()) {
            return page;
        } else {
            Meteor.Router.to('/login');
        }
    }
  });
  
  Template.dashboard.projects = Projects.find();
  
  Template.dashboard.events({
    'click .close' : function (event) {
      var id = $(event.currentTarget).parent().attr("data-project-id");
      if (confirm("Are you sure you want to delete this project?")) {
        Projects.remove(id);
      }
    }
  });
  
  // applies to all pages
  Meteor.Router.filter('checkLoggedIn', {except: 'home'});
  
  Meteor.startup(function () {
    $("[data-toggle=tooltip]").tooltip();
  });
}

if (Meteor.isServer) {
  var alchemyKey = 'f701335d151e046d8fec89263827c5b2a7161999';
  
  Meteor.startup(function () {
   fs = Npm.require('fs');
  });
  
  Meteor.methods({
    runNLP: function (proposal_id, project_id, text) {
      HTTP.post("http://access.alchemyapi.com/calls/text/TextGetRankedKeywords",
        {
          params: {
            apikey: alchemyKey,
            text: text,
            sentiment: 1,
            outputMode: 'json'
          }
        },
        function (error, result) {
          if (result.statusCode === 200) {
            Proposals.update({_id: proposal_id}, {$set: {keywords: result.data.keywords}});
            proposals = Proposals.find({project_id: project_id});
            fs.writeFile("proposal.txt", JSON.stringify(generate_json_summary(proposals)) , function (err){
              if (err) throw err;
              console.log('It\'s saved!');
            });
          }
      });
      HTTP.post("http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities",
        {
          params: {
            apikey: alchemyKey,
            text: text,
            sentiment: 1,
            outputMode: 'json'
          }
        },
        function (error, result) {
          if (result.statusCode === 200) {
            Proposals.update({_id: proposal_id}, {$set: {entities: result.data.entities}});
            console.log(result.data.entities);
          }
      });
      return 1;
    }
  });
}

generate_json_cloud_data = function(proposals) {
  var output = new Array();
  var frequencies = new Object();
  var sentiments = new Object();
  
  for (i in proposals) {
    var proposal = proposals[i];
    for (j in proposal.keywords){
      keyword = proposal.keywords[j];
      
      if (frequencies[keyword.text.toLowerCase()] == undefined){
        frequencies[keyword.text.toLowerCase()] = 0;
      }
      frequencies[keyword.text.toLowerCase()]++;
      var score = parseFloat(keyword.sentiment.score);
       if (sentiments[keyword.text.toLowerCase()] == undefined)
          sentiments[keyword.text.toLowerCase()] = new Array();
       sentiments[keyword.text.toLowerCase()].push(keyword.score);
    }
  }
  
  for (i in frequencies){
    frequency = frequencies[i];
    console.log(i);
    output.push({
      name: i,
      freq: (frequencies[i] != undefined) ? frequencies[i]: 0,
      score: avg(sentiments)
    });
  }
  
  return output;
}

generate_json_summary = function(proposals) {
  var output = new Array();
  var frequencies = new Object();
  var pos_frequencies = new Object();
  var neg_frequencies = new Object();
  var pos_sentiments = new Object();
  var neg_sentiments = new Object();
  
  for (i in proposals) {
    var proposal = proposals[i];
    for (j in proposal.keywords){
      keyword = proposal.keywords[j];
      
      if (frequencies[keyword.text.toLowerCase()] == undefined){
        frequencies[keyword.text.toLowerCase()] = 0;
      }
      frequencies[keyword.text.toLowerCase()]++;
      var score = parseFloat(keyword.sentiment.score);
      if (score > 0)
      {
       if (pos_frequencies[keyword.text.toLowerCase()] == undefined){
        pos_frequencies[keyword.text.toLowerCase()] = 0;
      }
        pos_frequencies[keyword.text.toLowerCase()]++;
        if (pos_sentiments[keyword.text.toLowerCase()] == undefined)
          pos_sentiments[keyword.text.toLowerCase()] = new Array();
        pos_sentiments[keyword.text.toLowerCase()].push(keyword.score);
      }
      else
      {
       if (neg_frequencies[keyword.text.toLowerCase()] == undefined){
        neg_frequencies[keyword.text.toLowerCase()] = 0;
      }
        neg_frequencies[keyword.text.toLowerCase()]++;
        if (neg_sentiments[keyword.text.toLowerCase()] == undefined)
          neg_sentiments[keyword.text.toLowerCase()] = new Array();
        neg_sentiments[keyword.text.toLowerCase()].push(keyword.score);
      }
    }
  }
  
  for (i in frequencies){
    frequency = frequencies[i];
    console.log(i);
    output.push({
      name: i,
      freq1: (pos_frequencies[i] != undefined) ? pos_frequencies[i]: 0,
      score1: Math.random(), //(avg(pos_sentiments[text]) != undefined) ? avg(pos_sentiments[text]): 0,
      freq2: (neg_frequencies[i] != undefined) ? neg_frequencies[i]: 0,
      score2: -1 * Math.random(), 
    });
  }
  
  return output;
}

avg = function(array){
  var sum = 0;
  var length = 0;
  for (item in array)
  {
    sum += item;
    length++;
  }
  return sum/length;
}

