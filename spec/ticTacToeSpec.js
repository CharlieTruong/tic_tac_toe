describe("Game", function() {
  var game;

  beforeEach(function() {
    setUpHTMLFixture();  
    game = new Game($("#board"),"X");
  });

  it("a new game has a win status of 'false.'", function() {
    expect(game.won).toEqual(false);
  });

  describe("#clickTableCell", function(){
    it("Board#setMarker is called when a table cell is clicked", function(){
      spyOn(game.board,'setMarker');
      game.board.$el.find("tr:eq(0) td:eq(0)").trigger("click");
      expect(game.board.setMarker).toHaveBeenCalled();
    });

    it("adds the player's marker to the chosen cell", function(){
      game.board.$el.find("tr:eq(2) td:eq(2)").trigger("click");
      expect(game.board.$el.find("tr:eq(2) td:eq(2)").html()).toEqual('X');
    });
  });
});

describe("Player", function(){
  describe("#marker",function(){
    it("a new player is initialized with a marker of 'X' or 'O'.", function(){
      var player = new Player('X');
      expect(player.marker).toEqual('X');
    });
  });
});

describe("Board", function(){
  var board;

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

  describe("#checkWinner", function(){
    it("returns true if three markers of the same kind appear vertically", function(){
      board.setMarker(0,1,"X");
      board.setMarker(1,1,"X");
      board.setMarker(2,1,"X");
      expect(board.checkWinner()).toEqual(true);
    });

    it("returns true if three markers of the same kind appear horizontally", function(){
      board.setMarker(2,0,"X");
      board.setMarker(2,1,"X");
      board.setMarker(2,2,"X");
      expect(board.checkWinner()).toEqual(true);
    });

    it("returns true if three markers of the same kind appear diagonally", function(){
      board.setMarker(0,0,"X");
      board.setMarker(1,1,"X");
      board.setMarker(2,2,"X");
      expect(board.checkWinner()).toEqual(true);
    });
  });

  describe("#clearMarkers", function(){
    it("clears the board of all markers", function(){
      board.setMarker(1,1,"X");
      board.setMarker(2,2,"X");
      board.clearMarkers();
      expect(board.$el.find("tr:eq(1) td:eq(1)").html()).toEqual("");
      expect(board.$el.find("tr:eq(2) td:eq(2)").html()).toEqual("");
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