describe("Game", function() {
  var game;

  beforeEach(function() {
    game = new Game();
  });

  it("a new game has a win status of 'false.'", function() {
    expect(game.won).toEqual(false);
  });
});

describe("Board", function(){
  var board;
  var fixture;

  beforeEach(function() {
    setUpHTMLFixture();  
    board = new Board($("#board"));
  });

  it("accepts a jQuery element representing the game board.", function(){
    expect(board.$el).toEqual($("#board"));
  });
});


function setUpHTMLFixture() {
  setFixtures('<table id="board">'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'</table>');
      
}