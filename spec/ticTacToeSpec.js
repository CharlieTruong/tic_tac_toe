describe("Game", function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  it("a new game has a win status of 'false.'", function() {
    expect(game.won).toEqual(false);
  });
});
