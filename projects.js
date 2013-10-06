if (Meteor.isClient) {
  Template.project_view.events({
    'click .close' : function (event) {
      var id = $(event.currentTarget).parent().attr("data-proposal-id");
      if (confirm("Are you sure you want to delete this proposal?")) {
        Proposals.remove(id);
      }
    }
  });
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
