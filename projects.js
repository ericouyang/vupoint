if (Meteor.isClient) {
  Template.project_new.events({
    'click button' : function () {
      Projects.insert({
        name: $("#project-name").val(),
        category: $("#project-category").val(),
        description: $("#project-description").val()
      });
      Meteor.Router.to('/dashboard');
    }
  });
}
