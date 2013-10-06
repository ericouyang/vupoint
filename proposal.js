if (Meteor.isClient) {
  Template.proposal_new.events({
    'click button' : function () {
      var id = Proposals.insert({
        project_id: Session.get('projectId'),
        summary: $('#proposal-summary').val(),
        text: $('#proposal-text').val(),
      });
      Meteor.call('runNLP', id, $('#proposal-text').val());
      Meteor.Router.to('/project/'+ Session.get('projectId'));
    }
  });
}
