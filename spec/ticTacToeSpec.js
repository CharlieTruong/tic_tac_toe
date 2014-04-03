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

  describe("#setMarker", function(){
    it("sets a marker at a given row and col position", function(){
      board.setMarker(0, 0, 'X');
      expect(board.$el.find("tr:eq(0) td:eq(0)").html()).toEqual('X');
    });

    it("does not allow a marker to be placed if one exists there already", function(){
      board.setMarker(0, 0, 'X');
      board.setMarker(0, 0, 'O');
      expect(board.$el.find("tr:eq(0) td:eq(0)").html()).not.toEqual('O');
    });
  });

  describe("#playerMarker",function(){
    it("sets a marker to identify the human player in the game", function(){
      board.playerMarker = 'X';
      expect(board.playerMarker).toEqual('X');
    });
  });

  describe("#clickTableCell", function(){
    it("#setMarker is called when a table cell is clicked", function(){
      spyOn(board,'setMarker');
      board.$el.find("tr:eq(0) td:eq(0)").trigger("click");
      expect(board.setMarker).toHaveBeenCalled();
    });

    it("adds the player's marker to the chosen cell", function(){
      board.playerMarker = 'O';
      board.$el.find("tr:eq(2) td:eq(2)").trigger("click");
      expect(board.$el.find("tr:eq(2) td:eq(2)").html()).toEqual('O');
    });
  });
});


function setUpHTMLFixture() {
  setFixtures('<table id="board">'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'  <tr><td></td><td></td><td></td></tr>'
             +'</table>');
      
}