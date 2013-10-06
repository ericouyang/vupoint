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
      Template.proposal_new.proposal = proposal
      Template.proposal_new.project = Projects.findOne({_id: proposal.project_id});
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
    // code to run on server at startup
  });
  
  Meteor.methods({
    runNLP: function (proposal_id, text) {
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

  Meteor.publish("projects", function() {
        return Projects.find({});
    });
}
