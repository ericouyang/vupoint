if (Meteor.isClient) {
  Template.proposal_new.events({
    'click button' : function () {
      Proposals.insert({
        project_id: Session.get('projectId'),
        text: $("#proposal-text").val()
      });
      Meteor.Router.to('/project/'+ Session.get('projectId'));
    }
  });
}
