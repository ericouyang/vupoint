Proposals = new Meteor.Collection("proposals");
Projects = new Meteor.Collection("projects");

if (Meteor.isClient) {
  Meteor.Router.add({
    '': 'home',
    '/dashboard': 'dashboard',
    '/project/new': 'project_new',
    '/project/:id': function(id) {
      Session.set('projectId', id);
      return 'project_view'
    },
    '/project/:id/proposal/new': function(id) {
      Template.proposal_new.project = Projects.findOne({_id: id});
      Session.set('projectId', id);
      return 'proposal_new';
    },
    '/proposal/:id': function(id) {
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

  // applies to all pages
  Meteor.Router.filter('checkLoggedIn', {except: 'home'});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  
  Meteor.publish("projects", function() {
        return Projects.find({});
    });
}
